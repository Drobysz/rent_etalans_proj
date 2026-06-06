"use client";

import { useState } from "react";
import type { Order } from "@/interfaces";
import { PaymentModal } from "@/components";
import { OrdersListHeader, OrdersTable, OrdersToolbar } from "./_components";
import styles from "./style.module.scss";
import type { OrdersListProps } from "./OrdersList.props";

export function OrdersList({ orders, reserveId, sort }: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <section className={styles.section}>
      <OrdersListHeader count={orders.length} sort={sort} />
      <OrdersToolbar reserveId={reserveId} sort={sort} />
      <OrdersTable orders={orders} onViewPayment={setSelectedOrder} />
      <PaymentModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </section>
  );
}
