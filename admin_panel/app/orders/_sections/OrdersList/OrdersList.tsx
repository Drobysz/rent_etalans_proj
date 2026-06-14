"use client";

import { useState } from "react";
import type { Order } from "@/interfaces";
import { PaymentModal } from "@/components";
import {
  OrdersListHeader,
  OrdersPagination,
  OrdersTable,
  OrdersToolbar,
} from "./_components";
import styles from "./style.module.scss";
import type { OrdersListProps } from "./OrdersList.props";

export function OrdersList({ orders, pagination, reserveId, sort }: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <section className={styles.section}>
      <OrdersListHeader count={pagination.total} sort={sort} />
      <OrdersToolbar reserveId={reserveId} sort={sort} />
      <OrdersTable orders={orders} onViewPayment={setSelectedOrder} />
      <OrdersPagination
        pagination={pagination}
        reserveId={reserveId}
        sort={sort}
      />
      <PaymentModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </section>
  );
}
