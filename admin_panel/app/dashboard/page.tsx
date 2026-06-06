import { getDashboard } from "@/queries";
import { DashboardOverview } from "./_sections";

export default async function DashboardPage() {
  const dashboard = await getDashboard();

  return <DashboardOverview dashboard={dashboard} />;
}
