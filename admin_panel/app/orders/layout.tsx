import { AdminLayout } from "@/app/layout/AdminLayout";
import { requireAdmin } from "@/auth/sessions";

type OrdersLayoutProps = {
  children: React.ReactNode;
};

export default async function OrdersLayout({ children }: OrdersLayoutProps) {
  const user = await requireAdmin();

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
