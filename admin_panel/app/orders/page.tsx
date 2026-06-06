import { OrdersList } from "./_sections";
import { getOrders } from "@/queries";

type OrdersPageProps = {
  searchParams: Promise<{
    reserve_id?: string;
    sort?: string;
  }>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const reserveId = params.reserve_id?.trim() ?? "";
  const sort = params.sort === "desc" ? "desc" : "asc";
  const orders = await getOrders({ reserveId, sort });

  return <OrdersList orders={orders} reserveId={reserveId} sort={sort} />;
}
