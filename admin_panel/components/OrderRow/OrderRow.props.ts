import type { Order } from "@/interfaces";

export type OrderRowProps = {
  order: Order;
  onViewPayment: (order: Order) => void;
};
