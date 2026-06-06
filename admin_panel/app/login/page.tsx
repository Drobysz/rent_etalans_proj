import { redirect } from "next/navigation";
import { getSession } from "@/auth/sessions";
import { LoginForm } from "./_components";
import styles from "./style.module.scss";

export default async function LoginPage() {
  const session = await getSession();

  if (session && ["admin", "superadmin"].includes(session.role)) {
    redirect("/");
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <h1>Admin login</h1>
          <p>Use an admin account to manage services and orders.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
