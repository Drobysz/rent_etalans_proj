import { OrderRow } from "@/components";
import styles from "./style.module.scss";
import type { OrdersTableProps } from "./OrdersTable.props";

export function OrdersTable({ orders, onViewPayment }: OrdersTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Guest</th>
            <th>Services</th>
            <th>Total</th>
            <th>Created</th>
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
