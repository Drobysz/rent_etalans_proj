export type ServiceImage = {
  id: string;
  filename: string;
  path: string;
  url: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  status: "active" | "draft";
  updatedAt: string;
  images: ServiceImage[];
  visible: boolean;
  fixedPrice: boolean;
};

export type NotificationStatus = "success" | "error";

export type AppNotification = {
  id: string;
  message: string;
  status: NotificationStatus;
};

export type PaymentInfo = {
  id: string;
  provider: "stripe" | "manual";
  status: "paid" | "pending" | "failed" | "refunded";
  amount: number;
  currency: string;
  transactionId: string;
  paymentMethod: string;
  receiptEmail: string;
  createdAt: string;
  metadata: Record<string, string>;
};

export type Order = {
  id: string;
  reserveId: string;
  guestName: string;
  guestEmail: string;
  apartmentName: string;
  services: string[];
  createdAt: string;
  total: number;
  payment: PaymentInfo;
};

export type UserRole = "superadmin" | "admin" | "client";

export type User = {
  id: string;
  name: string;
  tgNickname: string;
  role: UserRole;
};

export type AuthUser = Pick<User, "id" | "name" | "tgNickname" | "role">;

export type SessionPayload = AuthUser & {
  userId: string;
  accessToken: string;
  expiresAt: number;
};

export type DashboardRange = "week" | "month" | "year";

export type DashboardMetric = {
  week: number;
  month: number;
  year: number;
};

export type DashboardPoint = {
  label: string;
  revenue: number;
};

export type TopService = {
  name: string;
  count: number;
  revenue: number;
};

export type DashboardData = {
  revenue: DashboardMetric;
  orders: DashboardMetric;
  series: Record<DashboardRange, DashboardPoint[]>;
  topServices: TopService[];
};
