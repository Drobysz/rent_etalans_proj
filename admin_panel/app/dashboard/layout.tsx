import { AdminLayout } from "@/app/layout/AdminLayout";
import { requireAdmin } from "@/auth/sessions";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
