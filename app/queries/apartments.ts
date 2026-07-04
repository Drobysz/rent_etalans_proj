import { getBackendApiUrl } from "@/lib/api";
import type { Apartment } from "@/types";

type ApartmentsResponse = {
    data?: Apartment[];
};

export const getApartments = async (): Promise<Apartment[]> => {
    const res = await fetch(getBackendApiUrl("/apartments"), {
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch apartments");
    }

    const payload = await res.json() as ApartmentsResponse | Apartment[];

    return Array.isArray(payload) ? payload : payload.data ?? [];
};
