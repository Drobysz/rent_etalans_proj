import { OrderRow } from "@/components";
import styles from "./style.module.scss";
import type { OrdersTableProps } from "./OrdersTable.props";

export function OrdersTable({ orders, onViewPayment }: OrdersTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Commande</th>
            <th>Client</th>
            <th>Services</th>
            <th>Total</th>
            <th>Créée le</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onViewPayment={onViewPayment} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
