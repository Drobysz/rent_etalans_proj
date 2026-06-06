import styles from "./style.module.scss";
import type { AdminsTableProps } from "./AdminsTable.props";

export function AdminsTable({ users, onEdit }: AdminsTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Telegram</th>
            <th>Role</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.tgNickname}</td>
              <td>{user.role}</td>
              <td className={styles.actions}>
                <button className={styles.editButton} type="button" onClick={() => onEdit(user)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
