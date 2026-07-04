import { getBackendApiUrl } from "@/lib/api";

export type ReservationAvailability = {
    disabled_dates: string[];
    blocked_dates: string[];
    reserved_dates: string[];
};

export const getReservationAvailability = async (
    apartmentId?: number | null,
): Promise<ReservationAvailability> => {
    const search = apartmentId ? `?apartment_id=${apartmentId}` : "";
    const res = await fetch(getBackendApiUrl(`/reservations/availability${search}`), {
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch reservation availability");
    }

    return res.json() as Promise<ReservationAvailability>;
};
