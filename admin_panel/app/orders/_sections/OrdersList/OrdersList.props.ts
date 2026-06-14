import type { Order } from "@/interfaces";
import type { OrdersPagination } from "@/queries";

export type OrdersListProps = {
  orders: Order[];
  pagination: OrdersPagination;
  reserveId: string;
  sort: "asc" | "desc";
};
