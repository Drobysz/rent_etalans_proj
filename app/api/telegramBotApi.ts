import "server-only";

export type TelegramPurchaseNotificationParams = {
  email: string;
  reserveId: string;
  reservationCode?: string;
  visitorsCount: number;
  daysCount: number;
  totalPrice: number;
  serviceNames: string[];
  apartment?: {
    checkin?: string | null;
    checkout?: string | null;
    daysCount?: number | null;
  };
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

  const message = [
    "Nouvelle réservation payée",
    "",
    `Client : ${params.email}`,
    `Code de séjour : ${params.reservationCode ?? params.reserveId}`,
    `Référence de paiement : ${params.reserveId}`,
    "",
    `Voyageurs : ${params.visitorsCount}`,
    `Durée : ${params.apartment?.daysCount ?? params.daysCount} nuit(s)`,
    params.apartment?.checkin ? `Arrivée : ${params.apartment.checkin}` : null,
    params.apartment?.checkout ? `Départ : ${params.apartment.checkout}` : null,
    "",
    params.serviceNames.length > 0
      ? `Services : ${params.serviceNames.join(", ")}`
      : "Services : aucun",
    "",
    `Montant : ${params.totalPrice.toFixed(2)} EUR`,
    `Statut : ${params.paymentStatus ?? "payé"}`,
    params.sessionId ? `Session Stripe : ${params.sessionId}` : null,
  ].filter(Boolean).join("\n");

  const res = await fetch(notifyUrl!, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ...params,
      message,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    console.error("Telegram notification failed", error);
    throw new Error("Failed to send Telegram notification");
  }

  return res.json();
};
