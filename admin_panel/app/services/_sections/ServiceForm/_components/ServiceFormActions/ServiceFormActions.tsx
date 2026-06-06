import Link from "next/link";
import styles from "./style.module.scss";
import type { ServiceFormActionsProps } from "./ServiceFormActions.props";

export function ServiceFormActions({ pending }: ServiceFormActionsProps) {
  return (
    <div className={styles.actions}>
      <Link className={styles.secondaryButton} href="/services">
        Cancel
      </Link>
      <button className={styles.submitButton} type="submit" disabled={pending}>
        {pending ? "Creating" : "Create service"}
      </button>
    </div>
  );
}
