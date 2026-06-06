import { formatMoney } from "@/helpers";
import styles from "./style.module.scss";
import type { MetricGridProps } from "./MetricGrid.props";

export function MetricGrid({ revenue, orders }: MetricGridProps) {
  const metrics = [
    { label: "Revenue this week", value: formatMoney(revenue.week) },
    { label: "Revenue this month", value: formatMoney(revenue.month) },
    { label: "Revenue this year", value: formatMoney(revenue.year) },
    { label: "Orders this week", value: String(orders.week) },
    { label: "Orders this month", value: String(orders.month) },
    { label: "Orders this year", value: String(orders.year) },
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
