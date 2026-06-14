import type { DashboardData } from "@/interfaces";
import { getBackendApiUrl } from "@/lib/api";

type ApiDashboard = {
  revenue?: {
    week?: number;
    month?: number;
    year?: number;
  };
  orders?: {
    week?: number;
    month?: number;
    year?: number;
  };
  series?: DashboardData["series"];
  top_services?: DashboardData["topServices"];
};

export const mockDashboard: DashboardData = {
  revenue: {
    week: 206,
    month: 1480,
    year: 18340,
  },
  orders: {
    week: 3,
    month: 22,
    year: 284,
  },
  series: {
    week: [
      { label: "Mon", revenue: 0 },
      { label: "Tue", revenue: 49 },
      { label: "Wed", revenue: 72 },
      { label: "Thu", revenue: 0 },
      { label: "Fri", revenue: 85 },
      { label: "Sat", revenue: 0 },
      { label: "Sun", revenue: 0 },
    ],
    month: [
      { label: "Week 1", revenue: 280 },
      { label: "Week 2", revenue: 340 },
      { label: "Week 3", revenue: 520 },
      { label: "Week 4", revenue: 340 },
    ],
    year: [
      { label: "Jan", revenue: 1320 },
      { label: "Feb", revenue: 1180 },
      { label: "Mar", revenue: 1460 },
      { label: "Apr", revenue: 1580 },
      { label: "May", revenue: 1720 },
      { label: "Jun", revenue: 1480 },
      { label: "Jul", revenue: 0 },
      { label: "Aug", revenue: 0 },
      { label: "Sep", revenue: 0 },
      { label: "Oct", revenue: 0 },
      { label: "Nov", revenue: 0 },
      { label: "Dec", revenue: 0 },
    ],
  },
  topServices: [
    { name: "Mid-stay cleaning", count: 18, revenue: 882 },
    { name: "Airport transfer", count: 12, revenue: 864 },
    { name: "Breakfast delivery", count: 9, revenue: 162 },
  ],
};

export async function getDashboard(): Promise<DashboardData> {
  const apiUrl = getBackendApiUrl("/payments/dashboard");

  if (!apiUrl) {
    return mockDashboard;
  }

  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return mockDashboard;
    }

    const payload = (await response.json()) as ApiDashboard;

    return {
      revenue: {
        week: Number(payload.revenue?.week ?? 0),
        month: Number(payload.revenue?.month ?? 0),
        year: Number(payload.revenue?.year ?? 0),
      },
      orders: {
        week: Number(payload.orders?.week ?? 0),
        month: Number(payload.orders?.month ?? 0),
        year: Number(payload.orders?.year ?? 0),
      },
      series: payload.series ?? mockDashboard.series,
      topServices: payload.top_services ?? [],
    };
  } catch {
    return mockDashboard;
  }
}
