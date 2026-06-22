import Link from "next/link";
import styles from "./style.module.scss";
import type { ServiceFormHeaderProps } from "./ServiceFormHeader.props";

const copy = {
  create: {
    title: "Créer un service",
    note: "Ajoutez les détails requis du service pour le catalogue.",
  },
  edit: {
    title: "Modifier le service",
    note: "Mettez à jour les détails du service affichés aux clients.",
  },
};

export function ServiceFormHeader({ mode }: ServiceFormHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{copy[mode].title}</h1>
        <p className={styles.note}>{copy[mode].note}</p>
      </div>
      <Link className={styles.cancelLink} href="/services">
        Retour aux services
      </Link>
    </div>
  );
}
