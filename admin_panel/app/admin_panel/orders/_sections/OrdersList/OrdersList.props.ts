import type { Order } from "@/interfaces";

export type OrdersListProps = {
  orders: Order[];
  reserveId: string;
  sort: "asc" | "desc";
};
