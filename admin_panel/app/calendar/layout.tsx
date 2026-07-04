import { AdminLayout } from "@/app/layout/AdminLayout";
import { requireAdmin } from "@/auth/sessions";

type CalendarLayoutProps = {
  children: React.ReactNode;
};

export default async function CalendarLayout({ children }: CalendarLayoutProps) {
  const user = await requireAdmin();

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
