import styles from "./style.module.scss";
import type { OrdersListHeaderProps } from "./OrdersListHeader.props";

export function OrdersListHeader({ count, sort }: OrdersListHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Commandes</h1>
        <p className={styles.count}>
          {count} commandes, {sort === "desc" ? "plus récentes d'abord" : "plus anciennes d'abord"}
        </p>
      </div>
    </div>
  );
}
