import { formatDateTime, formatMoney } from "@/helpers";
import { StripeReceiptButton } from "./StripeReceiptButton";
import styles from "./style.module.scss";
import type { OrderRowProps } from "./OrderRow.props";

const paymentStatusLabels: Record<string, string> = {
  paid: "Payé",
  pending: "En attente",
  failed: "Échoué",
  refunded: "Remboursé",
};

export function OrderRow({ order, onViewPayment }: OrderRowProps) {
  const displayCode = order.reservationCode ?? order.reserveId;

  return (
    <tr className={styles.row}>
      <td>
        <span className={styles.strong}>{order.id}</span>
        {order.reservationCode ? (
          <span className={styles.badge}>{displayCode}</span>
        ) : (
          <span className={styles.subtle}>{displayCode}</span>
        )}
        <span className={styles.subtle}>{order.apartmentName}</span>
        {order.checkin && order.checkout ? (
          <span className={styles.subtle}>{order.checkin} - {order.checkout}</span>
        ) : null}
      </td>
      <td>
        <span className={styles.strong}>{order.guestName}</span>
        <span className={styles.subtle}>{order.guestEmail}</span>
      </td>
      <td className={styles.services}>
        {order.services.length > 0 ? order.services.join(", ") : "Aucun service"}
        {order.paymentStatus ? (
          <span className={styles.status}>
            {paymentStatusLabels[order.paymentStatus] ?? order.paymentStatus}
          </span>
        ) : null}
      </td>
      <td>{formatMoney(order.total)}</td>
      <td>{formatDateTime(order.createdAt)}</td>
      <td className={styles.actions}>
        <div className={styles.actionGroup}>
          <button className={styles.paymentButton} type="button" onClick={() => onViewPayment(order)}>
            Voir le paiement
          </button>
          <StripeReceiptButton sessionId={order.payment.sessionId} />
        </div>
      </td>
    </tr>
  );
}
