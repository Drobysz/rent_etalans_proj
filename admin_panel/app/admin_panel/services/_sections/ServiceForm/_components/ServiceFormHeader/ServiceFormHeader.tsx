import Link from "next/link";
import styles from "./style.module.scss";

export function ServiceFormHeader() {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Create service</h1>
        <p className={styles.note}>Add the required service details for the catalog.</p>
      </div>
      <Link className={styles.cancelLink} href="/admin_panel/services">
        Back to services
      </Link>
    </div>
  );
}
