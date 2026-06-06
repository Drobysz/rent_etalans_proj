import { ServicesGrid, ServicesListHeader } from "./_components";
import styles from "./style.module.scss";
import type { ServicesListProps } from "./ServicesList.props";

export function ServicesList({ services }: ServicesListProps) {
  return (
    <section className={styles.section}>
      <ServicesListHeader count={services.length} />
      <ServicesGrid services={services} />
    </section>
  );
}
