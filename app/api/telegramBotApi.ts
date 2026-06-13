import "server-only";

export type TelegramPurchaseNotificationParams = {
  email: string;
  reserveId: string;
  visitorsCount: number;
  daysCount: number;
  totalPrice: number;
  serviceIds: number[];
  paymentStatus?: string;
  sessionId?: string;
};

const TELEGRAM_API_URL = "https://api.telegram.org/bot";

const formatTelegramMessage = ({
  email,
  reserveId,
  visitorsCount,
  daysCount,
  totalPrice,
  serviceIds,
  paymentStatus,
  sessionId,
}: TelegramPurchaseNotificationParams) =>
  [
    "New purchase",
    "",
    `Email: ${email}`,
    `Reservation code: ${reserveId}`,
    `Visitors: ${visitorsCount}`,
    `Days: ${daysCount}`,
    `Total price: EUR ${totalPrice}`,
    `Service IDs: ${serviceIds.join(", ")}`,
    paymentStatus ? `Payment status: ${paymentStatus}` : null,
    sessionId ? `Stripe session: ${sessionId}` : null,
  ]
    .filter(Boolean)
    .join("\n");

export const sendTelegramPurchaseNotification = async (
  params: TelegramPurchaseNotificationParams,
) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram credentials are not configured");
    return null;
  }

  const res = await fetch(`${TELEGRAM_API_URL}${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramMessage(params),
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    console.error("Telegram notification failed", error);
    throw new Error("Failed to send Telegram notification");
  }

  return res.json();
};
