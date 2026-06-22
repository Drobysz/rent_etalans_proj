import styles from "./style.module.scss";
import type { AdminsTableProps } from "./AdminsTable.props";

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  superadmin: "Superadmin",
  client: "Client",
};

export function AdminsTable({ users, onEdit }: AdminsTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Telegram</th>
            <th>Rôle</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.tgNickname}</td>
              <td>{roleLabels[user.role] ?? user.role}</td>
              <td className={styles.actions}>
                <button className={styles.editButton} type="button" onClick={() => onEdit(user)}>
                  Modifier
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
