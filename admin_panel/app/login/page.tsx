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
          <h1>Connexion admin</h1>
          <p>Utilisez un compte admin pour gérer les services et les commandes.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
