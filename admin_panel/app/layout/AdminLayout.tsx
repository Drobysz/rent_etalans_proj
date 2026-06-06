import { Sidebar } from "./Sidebar/Sidebar";
import type { AdminLayoutProps } from "./AdminLayout.props";
import styles from "./style.module.scss";

export function AdminLayout({ children, user }: AdminLayoutProps) {
  return (
    <div className={styles.shell}>
      <Sidebar user={user} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
