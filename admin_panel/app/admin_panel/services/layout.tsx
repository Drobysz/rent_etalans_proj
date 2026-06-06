import { AdminLayout } from "@/app/layout/AdminLayout";
import { requireAdmin } from "@/auth/sessions";

type ServicesLayoutProps = {
  children: React.ReactNode;
};

export default async function ServicesLayout({ children }: ServicesLayoutProps) {
  const user = await requireAdmin();

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
