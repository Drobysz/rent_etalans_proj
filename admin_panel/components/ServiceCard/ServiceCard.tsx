/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import CloseIcon from "@/assets/close.svg";
import EditIcon from "@/assets/edit.svg";
import { formatDateTime, formatMoney } from "@/helpers";
import styles from "./style.module.scss";
import type { ServiceCardProps } from "./ServiceCard.props";

export function ServiceCard({ deleteAction, service }: ServiceCardProps) {
  const image = service.images[0];

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image ? (
          <img className={styles.image} src={image.url} alt={`${service.name} image`} />
        ) : (
          <span className={styles.emptyImage}>No image</span>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.topLine}>
          <h2 className={styles.name}>{service.name}</h2>
          <span className={styles.price}>{formatMoney(service.price)}</span>
        </div>
        <p className={styles.description}>{service.description}</p>
        <div className={styles.meta}>
          <span>{service.visible ? "Visible" : "Hidden"}</span>
          <span>{service.fixedPrice ? "Fixed price" : "Per day"}</span>
          <span>Updated {formatDateTime(service.updatedAt)}</span>
        </div>
      </div>
      <div className={styles.actions}>
        <Link
          className={styles.editButton}
          href={`/services/${service.id}/edit`}
          aria-label={`Edit ${service.name}`}
        >
          <EditIcon aria-hidden="true" />
        </Link>
        <form action={deleteAction}>
          <input type="hidden" name="serviceId" value={service.id} />
          <button
            className={styles.deleteButton}
            type="submit"
            aria-label={`Delete ${service.name}`}
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </form>
      </div>
    </article>
  );
}
