import { getUsers } from "@/queries";
import { AdminsList } from "./_sections";

export default async function AdminsPage() {
  const users = await getUsers();

  return <AdminsList users={users} />;
}
