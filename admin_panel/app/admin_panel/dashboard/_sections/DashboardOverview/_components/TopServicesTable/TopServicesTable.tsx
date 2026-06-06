import { formatMoney } from "@/helpers";
import styles from "./style.module.scss";
import type { TopServicesTableProps } from "./TopServicesTable.props";

export function TopServicesTable({ services }: TopServicesTableProps) {
  return (
    <article className={styles.panel}>
      <div className={styles.header}>
        <h2>Top services</h2>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Service</th>
              <th>Orders</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.name}>
                <td>{service.name}</td>
                <td>{service.count}</td>
                <td>{formatMoney(service.revenue)}</td>
              </tr>
            ))}
            {services.length === 0 ? (
              <tr>
                <td colSpan={3}>No service sales yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </article>
  );
}
