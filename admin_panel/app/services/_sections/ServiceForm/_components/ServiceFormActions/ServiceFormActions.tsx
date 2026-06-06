import Link from "next/link";
import styles from "./style.module.scss";
import type { ServiceFormActionsProps } from "./ServiceFormActions.props";

export function ServiceFormActions({
  mode,
  pending,
}: ServiceFormActionsProps) {
  const submitLabel = mode === "edit" ? "Save changes" : "Create service";
  const pendingLabel = mode === "edit" ? "Saving" : "Creating";

  return (
    <div className={styles.actions}>
      <Link className={styles.secondaryButton} href="/services">
        Cancel
      </Link>
      <button className={styles.submitButton} type="submit" disabled={pending}>
        {pending ? pendingLabel : submitLabel}
      </button>
    </div>
  );
}
