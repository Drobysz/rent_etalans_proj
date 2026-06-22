import styles from "./style.module.scss";

export function DashboardHeader() {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Tableau de bord</h1>
        <p className={styles.description}>Chiffre d'affaires, volume de commandes et demande par service.</p>
      </div>
    </div>
  );
}
