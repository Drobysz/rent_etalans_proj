import Link from "next/link";
import EditIcon from "@/assets/edit.svg";
import { formatDateTime, formatMoney } from "@/helpers";
import styles from "./style.module.scss";
import type { ServiceCardProps } from "./ServiceCard.props";

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <div className={styles.topLine}>
          <h2 className={styles.name}>{service.name}</h2>
          <span className={styles.price}>{formatMoney(service.price)}</span>
        </div>
        <p className={styles.description}>{service.description}</p>
        <div className={styles.meta}>
          <span>{service.status}</span>
          <span>Updated {formatDateTime(service.updatedAt)}</span>
        </div>
      </div>
      <Link
        className={styles.editButton}
        href={`/services/${service.id}/edit`}
        aria-label={`Edit ${service.name}`}
      >
        <EditIcon aria-hidden="true" />
      </Link>
    </article>
  );
}
