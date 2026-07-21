# Telegram purchase bot

This bot stores every chat that messages it in SQLite, then sends purchase notifications to all active saved chats.

## Run

```bash
TELEGRAM_BOT_TOKEN=your_bot_token \
TELEGRAM_NOTIFY_SECRET=optional_shared_secret \
python3 telegram_bot/purchase_bot.py
```

Defaults:

```txt
TELEGRAM_BOT_HOST=127.0.0.1
TELEGRAM_BOT_PORT=8765
TELEGRAM_BOT_DB_PATH=telegram_bot/chats.sqlite3
```

Send `/start` to the bot in every private chat or group that should receive purchase notifications. Telegram does not provide a Bot API method for listing every existing dialog, so the bot can only notify chats it has seen through updates.

The Next.js app calls:

```txt
POST http://127.0.0.1:8765/notify-purchase
```

The request body contains only the message already formatted by the app:

```json
{
  "message": "Nouvelle réservation payée\n..."
}
```

If `TELEGRAM_NOTIFY_SECRET` is set on both sides, the app sends it as `X-Notification-Secret`.
