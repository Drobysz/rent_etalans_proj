import { DashboardHeader, MetricGrid, RevenueChart, TopServicesTable } from "./_components";
import styles from "./style.module.scss";
import type { DashboardOverviewProps } from "./DashboardOverview.props";

export function DashboardOverview({ dashboard }: DashboardOverviewProps) {
  return (
    <section className={styles.section}>
      <DashboardHeader />
      <MetricGrid revenue={dashboard.revenue} orders={dashboard.orders} />
      <div className={styles.grid}>
        <RevenueChart series={dashboard.series} />
        <TopServicesTable services={dashboard.topServices} />
      </div>
    </section>
  );
}
