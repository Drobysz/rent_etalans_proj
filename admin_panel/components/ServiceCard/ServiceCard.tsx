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
          <img className={styles.image} src={image.url} alt={`Image de ${service.name}`} />
        ) : (
          <span className={styles.emptyImage}>Aucune image</span>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.topLine}>
          <h2 className={styles.name}>{service.name}</h2>
          <span className={styles.price}>{formatMoney(service.price)}</span>
        </div>
        <p className={styles.description}>{service.description}</p>
        <div className={styles.meta}>
          <span>{service.visible ? "Visible" : "Masqué"}</span>
          <span>{service.fixedPrice ? "Prix fixe" : "Par jour"}</span>
          <span>Mis à jour le {formatDateTime(service.updatedAt)}</span>
        </div>
      </div>
      <div className={styles.actions}>
        <Link
          className={styles.editButton}
          href={`/services/${service.id}/edit`}
          aria-label={`Modifier ${service.name}`}
        >
          <EditIcon aria-hidden="true" />
        </Link>
        <form action={deleteAction}>
          <input type="hidden" name="serviceId" value={service.id} />
          <button
            className={styles.deleteButton}
            type="submit"
            aria-label={`Supprimer ${service.name}`}
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </form>
      </div>
    </article>
  );
}
