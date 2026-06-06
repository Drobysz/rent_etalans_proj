import { ServiceCard } from "@/components";
import styles from "./style.module.scss";
import type { ServicesGridProps } from "./ServicesGrid.props";

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <div className={styles.grid}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
