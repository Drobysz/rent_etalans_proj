import type { Order } from "@/interfaces";

export type PaymentModalProps = {
  order: Order | null;
  onClose: () => void;
};
