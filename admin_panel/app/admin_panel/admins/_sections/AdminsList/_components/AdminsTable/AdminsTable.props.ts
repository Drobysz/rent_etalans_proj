import type { User } from "@/interfaces";

export type AdminsTableProps = {
  users: User[];
  onEdit: (user: User) => void;
};
