import Link from "next/link";
import styles from "./style.module.scss";
import type { ServicesListHeaderProps } from "./ServicesListHeader.props";

export function ServicesListHeader({ count }: ServicesListHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Services</h1>
        <p className={styles.count}>{count} services</p>
      </div>
      <Link className={styles.createButton} href="/admin_panel/services/new">
        Create service
      </Link>
    </div>
  );
}
