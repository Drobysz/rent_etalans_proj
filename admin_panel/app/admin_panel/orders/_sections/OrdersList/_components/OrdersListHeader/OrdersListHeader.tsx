import styles from "./style.module.scss";
import type { OrdersListHeaderProps } from "./OrdersListHeader.props";

export function OrdersListHeader({ count, sort }: OrdersListHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Orders</h1>
        <p className={styles.count}>
          {count} orders, {sort === "desc" ? "newest first" : "oldest first"}
        </p>
      </div>
    </div>
  );
}
