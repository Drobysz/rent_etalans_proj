import type { User } from "@/interfaces";

export type UserModalProps = {
  mode: "create" | "edit";
  open: boolean;
  user?: User | null;
  onClose: () => void;
};
