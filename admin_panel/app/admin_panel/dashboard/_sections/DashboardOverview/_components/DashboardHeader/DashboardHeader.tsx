import styles from "./style.module.scss";

export function DashboardHeader() {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.description}>Revenue, order volume, and service demand.</p>
      </div>
    </div>
  );
}
