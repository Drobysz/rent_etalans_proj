import { AdminLayout } from "@/app/layout/AdminLayout";
import { requireAdmin } from "@/auth/sessions";
import { getDashboard } from "@/queries";
import { DashboardOverview } from "./dashboard/_sections";

export default async function HomePage() {
  const user = await requireAdmin();
  const dashboard = await getDashboard();

  return (
    <AdminLayout user={user}>
      <DashboardOverview dashboard={dashboard} />
    </AdminLayout>
  );
}
