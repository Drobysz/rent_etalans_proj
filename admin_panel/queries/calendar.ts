import { getBackendApiUrl } from "@/lib/api";

export type BlockedDate = {
  id: number;
  date: string;
  start_date?: string | null;
  end_date?: string | null;
  reason?: string | null;
};

export async function getBlockedDates(): Promise<BlockedDate[]> {
  const response = await fetch(getBackendApiUrl("/blocked-dates"), {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les dates bloquées.");
  }

  return response.json() as Promise<BlockedDate[]>;
}

export async function blockDateRange(startDate: string, endDate: string, reason?: string): Promise<BlockedDate> {
  const response = await fetch(getBackendApiUrl("/blocked-dates"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ start_date: startDate, end_date: endDate, reason }),
  });

  if (!response.ok) {
    throw new Error("Impossible de bloquer cette période.");
  }

  return response.json() as Promise<BlockedDate>;
}

export async function unblockDateRange(id: number): Promise<void> {
  const response = await fetch(getBackendApiUrl(`/blocked-dates/${id}`), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de débloquer cette date.");
  }
}
