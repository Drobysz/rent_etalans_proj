import Link from "next/link";
import styles from "./style.module.scss";
import type { ServiceFormHeaderProps } from "./ServiceFormHeader.props";

const copy = {
  create: {
    title: "Create service",
    note: "Add the required service details for the catalog.",
  },
  edit: {
    title: "Edit service",
    note: "Update the service details shown to clients.",
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
        Back to services
      </Link>
    </div>
  );
}
