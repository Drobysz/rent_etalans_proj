import type { Order } from "@/interfaces";
import { getBackendApiUrl } from "@/lib/api";

export const mockOrders: Order[] = [
  {
    id: "ord-1048",
    reserveId: "RSV-5831",
    guestName: "Lea Martin",
    guestEmail: "lea.martin@example.com",
    apartmentName: "Studio Rue Oberkampf",
    services: ["Ménage en cours de séjour", "Livraison du petit-déjeuner"],
    createdAt: "2026-06-05T08:20:00.000Z",
    total: 85,
    payment: {
      id: "pay-9K83L",
      provider: "stripe",
      status: "paid",
      amount: 85,
      currency: "EUR",
      transactionId: "pi_3P8xQ8Lw",
      paymentMethod: "Visa se terminant par 4242",
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
    apartmentName: "Appartement Canal Saint-Martin",
    services: ["Transfert aéroport"],
    createdAt: "2026-06-04T18:05:00.000Z",
    total: 72,
    payment: {
      id: "pay-2M19Q",
      provider: "stripe",
      status: "pending",
      amount: 72,
      currency: "EUR",
      transactionId: "pi_3P8rS2Jm",
      paymentMethod: "Mastercard se terminant par 1881",
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
    services: ["Ménage en cours de séjour"],
    createdAt: "2026-06-03T10:35:00.000Z",
    total: 49,
    payment: {
      id: "pay-6N42A",
      provider: "manual",
      status: "paid",
      amount: 49,
      currency: "EUR",
      transactionId: "manual-7784",
      paymentMethod: "Virement bancaire",
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
  session_id?: string | null;
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
  page?: number;
};

export type OrdersPagination = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
};

export type OrdersResult = {
  orders: Order[];
  pagination: OrdersPagination;
};

const makePagination = (
  total: number,
  currentPage = 1,
  perPage = 7,
): OrdersPagination => {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(currentPage, 1), lastPage);
  const from = total === 0 ? null : (safePage - 1) * perPage + 1;
  const to = total === 0 ? null : Math.min(safePage * perPage, total);

  return {
    currentPage: safePage,
    lastPage,
    perPage,
    total,
    from,
    to,
  };
};

const paginateOrders = (
  orders: Order[],
  page = 1,
  perPage = 7,
): OrdersResult => {
  const pagination = makePagination(orders.length, page, perPage);
  const start = (pagination.currentPage - 1) * perPage;

  return {
    orders: orders.slice(start, start + perPage),
    pagination,
  };
};

export async function getOrders(query: OrdersQuery = {}): Promise<OrdersResult> {
  const page = Math.max(1, query.page ?? 1);
  const apiUrl = getBackendApiUrl("/payments");

  if (!apiUrl) {
    return paginateOrders(
      sortOrders(filterOrders(mockOrders, query.reserveId), query.sort),
      page,
    );
  }

  try {
    const params = new URLSearchParams();
    if (query.reserveId) {
      params.set("reserve_id", query.reserveId);
    }
    if (query.sort) {
      params.set("sort", query.sort);
    }
    params.set("page", String(page));

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return paginateOrders(sortOrders(mockOrders, query.sort), page);
    }

    const payload = (await response.json()) as {
      data?: ApiPayment[];
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
      from?: number | null;
      to?: number | null;
    };
    const payments = payload.data ?? [];

    const orders = sortOrders(
      payments.map((payment) => ({
        id: String(payment.id),
        reserveId: payment.reserve_id ?? "inconnu",
        guestName: `Client ${payment.client_number ?? payment.id}`,
        guestEmail: payment.email,
        apartmentName: "Appartement",
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
          paymentMethod: "Carte",
          receiptEmail: payment.email,
          createdAt: payment.created_at ?? new Date().toISOString(),
          sessionId: payment.session_id ?? undefined,
          metadata: {
            reserveId: payment.reserve_id ?? "inconnu",
            stripeSessionId: payment.session_id ?? "",
            source: "api",
          },
        },
      })),
      query.sort,
    );

    return {
      orders,
      pagination: {
        currentPage: Number(payload.current_page ?? page),
        lastPage: Number(payload.last_page ?? 1),
        perPage: Number(payload.per_page ?? (orders.length || 7)),
        total: Number(payload.total ?? orders.length),
        from: payload.from ?? null,
        to: payload.to ?? null,
      },
    };
  } catch {
    return paginateOrders(
      sortOrders(filterOrders(mockOrders, query.reserveId), query.sort),
      page,
    );
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
