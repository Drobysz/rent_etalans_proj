import { formatDateTime, formatMoney } from "@/helpers";
import { StripeReceiptButton } from "./StripeReceiptButton";
import styles from "./style.module.scss";
import type { OrderRowProps } from "./OrderRow.props";

export function OrderRow({ order, onViewPayment }: OrderRowProps) {
  return (
    <tr className={styles.row}>
      <td>
        <span className={styles.strong}>{order.id}</span>
        <span className={styles.subtle}>{order.reserveId}</span>
        <span className={styles.subtle}>{order.apartmentName}</span>
      </td>
      <td>
        <span className={styles.strong}>{order.guestName}</span>
        <span className={styles.subtle}>{order.guestEmail}</span>
      </td>
      <td className={styles.services}>{order.services.join(", ") || "No services"}</td>
      <td>{formatMoney(order.total)}</td>
      <td>{formatDateTime(order.createdAt)}</td>
      <td className={styles.actions}>
        <div className={styles.actionGroup}>
          <button className={styles.paymentButton} type="button" onClick={() => onViewPayment(order)}>
            View payment
          </button>
          <StripeReceiptButton sessionId={order.payment.sessionId} />
        </div>
      </td>
    </tr>
  );
}
