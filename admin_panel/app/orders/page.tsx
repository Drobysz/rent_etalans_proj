import { OrdersList } from "./_sections";
import { getOrders } from "@/queries";

type OrdersPageProps = {
  searchParams: Promise<{
    reserve_id?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const reserveId = params.reserve_id?.trim() ?? "";
  const sort = params.sort === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const { orders, pagination } = await getOrders({ reserveId, sort, page });

  return (
    <OrdersList
      orders={orders}
      pagination={pagination}
      reserveId={reserveId}
      sort={sort}
    />
  );
}
