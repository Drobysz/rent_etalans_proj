import styles from "./style.module.scss";
import type { AdminsHeaderProps } from "./AdminsHeader.props";

export function AdminsHeader({ count, onCreate }: AdminsHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Administrateurs</h1>
        <p className={styles.count}>{count} utilisateurs gérables</p>
      </div>
      <button className={styles.createButton} type="button" onClick={onCreate}>
        Créer un utilisateur
      </button>
    </div>
  );
}
