import type { Order } from "@/interfaces";

export type OrdersTableProps = {
  orders: Order[];
  onViewPayment: (order: Order) => void;
};
