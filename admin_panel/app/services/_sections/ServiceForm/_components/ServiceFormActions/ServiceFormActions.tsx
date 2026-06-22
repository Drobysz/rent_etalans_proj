import Link from "next/link";
import styles from "./style.module.scss";
import type { ServiceFormActionsProps } from "./ServiceFormActions.props";

export function ServiceFormActions({
  mode,
  pending,
}: ServiceFormActionsProps) {
  const submitLabel = mode === "edit" ? "Enregistrer les modifications" : "Créer le service";
  const pendingLabel = mode === "edit" ? "Enregistrement" : "Création";

  return (
    <div className={styles.actions}>
      <Link className={styles.secondaryButton} href="/services">
        Annuler
      </Link>
      <button className={styles.submitButton} type="submit" disabled={pending}>
        {pending ? pendingLabel : submitLabel}
      </button>
    </div>
  );
}
