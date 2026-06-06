import { AdminLayout } from "@/app/layout/AdminLayout";
import { requireSuperadmin } from "@/auth/sessions";

export default async function AdminsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireSuperadmin();

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
