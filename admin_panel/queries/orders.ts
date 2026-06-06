import type { Order } from "@/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const mockOrders: Order[] = [
  {
    id: "ord-1048",
    reserveId: "RSV-5831",
    guestName: "Lea Martin",
    guestEmail: "lea.martin@example.com",
    apartmentName: "Rue Oberkampf Studio",
    services: ["Mid-stay cleaning", "Breakfast delivery"],
    createdAt: "2026-06-05T08:20:00.000Z",
    total: 85,
    payment: {
      id: "pay-9K83L",
      provider: "stripe",
      status: "paid",
      amount: 85,
      currency: "EUR",
      transactionId: "pi_3P8xQ8Lw",
      paymentMethod: "Visa ending 4242",
      receiptEmail: "lea.martin@example.com",
      createdAt: "2026-06-05T08:21:00.000Z",
      metadata: {
        reserveId: "RSV-5831",
        apartmentId: "APT-12",
        source: "guest-checkout",
      },
    },
  },
  {
    id: "ord-1047",
    reserveId: "RSV-5802",
    guestName: "Marco Bianchi",
    guestEmail: "marco.bianchi@example.com",
    apartmentName: "Canal Saint-Martin Flat",
    services: ["Airport transfer"],
    createdAt: "2026-06-04T18:05:00.000Z",
    total: 72,
    payment: {
      id: "pay-2M19Q",
      provider: "stripe",
      status: "pending",
      amount: 72,
      currency: "EUR",
      transactionId: "pi_3P8rS2Jm",
      paymentMethod: "Mastercard ending 1881",
      receiptEmail: "marco.bianchi@example.com",
      createdAt: "2026-06-04T18:06:00.000Z",
      metadata: {
        reserveId: "RSV-5802",
        apartmentId: "APT-07",
        source: "admin-link",
      },
    },
  },
  {
    id: "ord-1046",
    reserveId: "RSV-5766",
    guestName: "Nora Schmidt",
    guestEmail: "nora.schmidt@example.com",
    apartmentName: "Montmartre Loft",
    services: ["Mid-stay cleaning"],
    createdAt: "2026-06-03T10:35:00.000Z",
    total: 49,
    payment: {
      id: "pay-6N42A",
      provider: "manual",
      status: "paid",
      amount: 49,
      currency: "EUR",
      transactionId: "manual-7784",
      paymentMethod: "Bank transfer",
      receiptEmail: "nora.schmidt@example.com",
      createdAt: "2026-06-03T10:41:00.000Z",
      metadata: {
        reserveId: "RSV-5766",
        apartmentId: "APT-19",
        reconciledBy: "ops@example.com",
      },
    },
  },
];

type ApiPayment = {
  id: number | string;
  email: string;
  client_number?: number | string;
  total_price?: number | string;
  reserve_id?: string;
  created_at?: string;
  services?: { name: string }[];
};

export type OrdersQuery = {
  reserveId?: string;
  sort?: "asc" | "desc";
};

export async function getOrders(query: OrdersQuery = {}): Promise<Order[]> {
  if (!API_URL) {
    return sortOrders(filterOrders(mockOrders, query.reserveId), query.sort);
  }

  try {
    const params = new URLSearchParams();
    if (query.reserveId) {
      params.set("reserve_id", query.reserveId);
    }
    if (query.sort) {
      params.set("sort", query.sort);
    }

    const path = params.size ? `/payments?${params.toString()}` : "/payments";
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return sortOrders(mockOrders);
    }

    const payload = (await response.json()) as { data?: ApiPayment[] };
    const payments = payload.data ?? [];

    return sortOrders(
      payments.map((payment) => ({
        id: String(payment.id),
        reserveId: payment.reserve_id ?? "unknown",
        guestName: `Client ${payment.client_number ?? payment.id}`,
        guestEmail: payment.email,
        apartmentName: "Apartment",
        services: payment.services?.map((service) => service.name) ?? [],
        createdAt: payment.created_at ?? new Date().toISOString(),
        total: Number(payment.total_price ?? 0),
        payment: {
          id: `payment-${payment.id}`,
          provider: "stripe",
          status: "paid",
          amount: Number(payment.total_price ?? 0),
          currency: "EUR",
          transactionId: payment.reserve_id ?? String(payment.id),
          paymentMethod: "Card",
          receiptEmail: payment.email,
          createdAt: payment.created_at ?? new Date().toISOString(),
          metadata: {
            reserveId: payment.reserve_id ?? "unknown",
            source: "api",
          },
        },
      })),
      query.sort,
    );
  } catch {
    return sortOrders(filterOrders(mockOrders, query.reserveId), query.sort);
  }
}

function filterOrders(orders: Order[], reserveId?: string) {
  if (!reserveId) {
    return orders;
  }

  return orders.filter((order) =>
    order.reserveId.toLowerCase().includes(reserveId.toLowerCase()),
  );
}

function sortOrders(orders: Order[], sort: OrdersQuery["sort"] = "desc") {
  return [...orders].sort(
    (a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "asc" ? diff : -diff;
    },
  );
}
