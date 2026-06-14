import type { OrdersPagination as OrdersPaginationData } from "@/queries";

export type OrdersPaginationProps = {
  pagination: OrdersPaginationData;
  reserveId: string;
  sort: "asc" | "desc";
};
