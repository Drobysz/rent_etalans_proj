import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const notifyUrl = process.env.TELEGRAM_BOT_NOTIFY_URL;

  if (!notifyUrl) {
    return NextResponse.json(
      { message: "TELEGRAM_BOT_NOTIFY_URL is not configured." },
      { status: 500 },
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const notifySecret = process.env.TELEGRAM_NOTIFY_SECRET;

  if (notifySecret) {
    headers["X-Notification-Secret"] = notifySecret;
  }

  const response = await fetch(notifyUrl, {
    method: "POST",
    headers,
    body: await request.text(),
    cache: "no-store",
  });

  const payload = await response.text();

  return new NextResponse(payload, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}

