#!/usr/bin/env python3
import json
import os
import signal
import sqlite3
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any


ROOT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = ROOT_DIR.parent


def load_env_file(path: Path) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


for env_path in (
    PROJECT_DIR / ".env",
    PROJECT_DIR / "app" / ".env",
    ROOT_DIR / ".env",
):
    load_env_file(env_path)


DB_PATH = Path(os.getenv("TELEGRAM_BOT_DB_PATH", ROOT_DIR / "chats.sqlite3"))
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN") or os.getenv("TELEGRAM_API_URL", "")
HOST = os.getenv("TELEGRAM_BOT_HOST", "127.0.0.1")
PORT = int(os.getenv("TELEGRAM_BOT_PORT", "8765"))
NOTIFY_SECRET = os.getenv("TELEGRAM_NOTIFY_SECRET", "")
POLL_TIMEOUT = int(os.getenv("TELEGRAM_POLL_TIMEOUT", "30"))

stop_event = threading.Event()


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def db_connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with db_connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS chats (
                chat_id INTEGER PRIMARY KEY,
                chat_type TEXT,
                title TEXT,
                username TEXT,
                first_name TEXT,
                last_name TEXT,
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS bot_state (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
            """
        )


def save_chat(chat: dict[str, Any], is_active: bool = True) -> None:
    chat_id = chat.get("id")
    if chat_id is None:
        return

    now = utc_now()

    with db_connect() as conn:
        conn.execute(
            """
            INSERT INTO chats (
                chat_id,
                chat_type,
                title,
                username,
                first_name,
                last_name,
                is_active,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(chat_id) DO UPDATE SET
                chat_type = excluded.chat_type,
                title = excluded.title,
                username = excluded.username,
                first_name = excluded.first_name,
                last_name = excluded.last_name,
                is_active = excluded.is_active,
                updated_at = excluded.updated_at
            """,
            (
                chat_id,
                chat.get("type"),
                chat.get("title"),
                chat.get("username"),
                chat.get("first_name"),
                chat.get("last_name"),
                1 if is_active else 0,
                now,
                now,
            ),
        )


def active_chat_ids() -> list[int]:
    with db_connect() as conn:
        rows = conn.execute(
            "SELECT chat_id FROM chats WHERE is_active = 1 ORDER BY updated_at DESC"
        ).fetchall()

    return [int(row["chat_id"]) for row in rows]


def get_state(key: str, default: str = "0") -> str:
    with db_connect() as conn:
        row = conn.execute(
            "SELECT value FROM bot_state WHERE key = ?",
            (key,),
        ).fetchone()

    return str(row["value"]) if row else default


def set_state(key: str, value: str) -> None:
    with db_connect() as conn:
        conn.execute(
            """
            INSERT INTO bot_state (key, value)
            VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
            """,
            (key, value),
        )


def telegram_api(method: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    if not BOT_TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is not configured")

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/{method}"
    data = None
    headers = {}

    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = urllib.request.Request(url, data=data, headers=headers, method="POST")

    with urllib.request.urlopen(request, timeout=POLL_TIMEOUT + 10) as response:
        return json.loads(response.read().decode("utf-8"))


def send_message(chat_id: int, text: str) -> bool:
    try:
        telegram_api(
            "sendMessage",
            {
                "chat_id": chat_id,
                "text": text,
                "disable_web_page_preview": True,
            },
        )
        return True
    except urllib.error.HTTPError as error:
        if error.code in (400, 403):
            with db_connect() as conn:
                conn.execute(
                    "UPDATE chats SET is_active = 0, updated_at = ? WHERE chat_id = ?",
                    (utc_now(), chat_id),
                )
        print(f"Failed to send Telegram message to {chat_id}: {error}")
        return False
    except Exception as error:
        print(f"Failed to send Telegram message to {chat_id}: {error}")
        return False


def notify_purchase(message: str) -> dict[str, Any]:
    chat_ids = active_chat_ids()
    sent = []
    failed = []

    for chat_id in chat_ids:
        if send_message(chat_id, message):
            sent.append(chat_id)
        else:
            failed.append(chat_id)

    return {
        "ok": True,
        "sent": sent,
        "failed": failed,
        "chat_count": len(chat_ids),
    }


def extract_chat(update: dict[str, Any]) -> tuple[dict[str, Any] | None, bool]:
    for key in ("message", "channel_post", "edited_message", "edited_channel_post"):
        message = update.get(key)
        if message and message.get("chat"):
            return message["chat"], True

    member_update = update.get("my_chat_member")
    if member_update and member_update.get("chat"):
        status = (member_update.get("new_chat_member") or {}).get("status")
        return member_update["chat"], status not in ("kicked", "left")

    return None, True


def process_update(update: dict[str, Any]) -> None:
    chat, is_active = extract_chat(update)
    if not chat:
        return

    save_chat(chat, is_active=is_active)

    message = update.get("message")
    text = (message or {}).get("text", "")
    if text.startswith("/start"):
        send_message(
            int(chat["id"]),
            "Chat saved. Purchase notifications will be sent here.",
        )


def poll_updates() -> None:
    offset = int(get_state("telegram_update_offset", "0"))

    while not stop_event.is_set():
        try:
            response = telegram_api(
                "getUpdates",
                {
                    "offset": offset,
                    "timeout": POLL_TIMEOUT,
                    "allowed_updates": [
                        "message",
                        "channel_post",
                        "my_chat_member",
                    ],
                },
            )

            for update in response.get("result", []):
                process_update(update)
                offset = int(update["update_id"]) + 1
                set_state("telegram_update_offset", str(offset))
        except Exception as error:
            print(f"Telegram polling error: {error}")
            time.sleep(5)


class BotRequestHandler(BaseHTTPRequestHandler):
    def send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path == "/health":
            self.send_json(200, {"ok": True, "chat_count": len(active_chat_ids())})
            return

        self.send_json(404, {"message": "Not found"})

    def do_POST(self) -> None:
        if self.path != "/notify-purchase":
            self.send_json(404, {"message": "Not found"})
            return

        if NOTIFY_SECRET and self.headers.get("X-Notification-Secret") != NOTIFY_SECRET:
            self.send_json(401, {"message": "Unauthorized"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        except json.JSONDecodeError:
            self.send_json(400, {"message": "Invalid JSON"})
            return

        message = payload.get("message") if isinstance(payload, dict) else None
        if not isinstance(message, str) or not message.strip():
            self.send_json(400, {"message": "A non-empty message is required"})
            return

        self.send_json(200, notify_purchase(message))

    def log_message(self, format: str, *args: Any) -> None:
        return


def run_server() -> None:
    server = ThreadingHTTPServer((HOST, PORT), BotRequestHandler)
    server.timeout = 1
    print(f"Telegram purchase bot HTTP server listening on http://{HOST}:{PORT}")

    while not stop_event.is_set():
        server.handle_request()

    server.server_close()


def shutdown(_signum: int, _frame: Any) -> None:
    stop_event.set()


def main() -> None:
    init_db()

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    polling_thread = threading.Thread(target=poll_updates, daemon=True)
    polling_thread.start()

    run_server()


if __name__ == "__main__":
    main()
