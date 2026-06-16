import "server-only";

export type TelegramPurchaseNotificationParams = {
  email: string;
  reserveId: string;
  visitorsCount: number;
  daysCount: number;
  totalPrice: number;
  serviceNames: string[];
  paymentStatus?: string;
  sessionId?: string;
};

export const sendTelegramPurchaseNotification = async (
  params: TelegramPurchaseNotificationParams,
) => {
  const notifyUrl = process.env.TELEGRAM_BOT_NOTIFY_URL;
  const notifySecret = process.env.TELEGRAM_NOTIFY_SECRET;

  if (!notifyUrl) {
    console.warn("Telegram bot notify URL is not configured");
    return null;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (notifySecret) {
    headers["X-Notification-Secret"] = notifySecret;
  }

  const res = await fetch(notifyUrl!, {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    console.error("Telegram notification failed", error);
    throw new Error("Failed to send Telegram notification");
  }

  return res.json();
};
