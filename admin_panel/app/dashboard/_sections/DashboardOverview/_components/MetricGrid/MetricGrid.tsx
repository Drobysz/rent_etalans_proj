import { formatMoney } from "@/helpers";
import styles from "./style.module.scss";
import type { MetricGridProps } from "./MetricGrid.props";

export function MetricGrid({ revenue, orders }: MetricGridProps) {
  const metrics = [
    { label: "Chiffre d'affaires cette semaine", value: formatMoney(revenue.week) },
    { label: "Chiffre d'affaires ce mois-ci", value: formatMoney(revenue.month) },
    { label: "Chiffre d'affaires cette année", value: formatMoney(revenue.year) },
    { label: "Commandes cette semaine", value: String(orders.week) },
    { label: "Commandes ce mois-ci", value: String(orders.month) },
    { label: "Commandes cette année", value: String(orders.year) },
  ];

  return (
    <div className={styles.grid}>
      {metrics.map((metric) => (
        <article className={styles.metric} key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
        </article>
      ))}
    </div>
  );
}
