"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import type { ReservationContextValue } from "./reservation.interface";

const getDaysCount = (checkin: string | null, checkout: string | null) => {
    if (!checkin || !checkout) return 0;

    const start = new Date(`${checkin}T00:00:00`);
    const end = new Date(`${checkout}T00:00:00`);
    const diff = end.getTime() - start.getTime();

    return Math.max(0, Math.round(diff / 86_400_000));
};

export const ReservationContext = createContext<ReservationContextValue | null>(null);

export const ReservationContextProvider = ({
    children
}: {
    children: ReactNode
})=> {
    const [email, setEmail] = useState("");
    const [checkin, setCheckin] = useState<string | null>(null);
    const [checkout, setCheckout] = useState<string | null>(null);
    const [apartmentId, setApartmentId] = useState<number | null>(null);
    const [roomsCount, setRoomsCount] = useState<1 | 2>(1);
    const [guests, setGuests] = useState(1);
    const daysCount = getDaysCount(checkin, checkout);

    const value = useMemo<ReservationContextValue>(() => ({
        email,
        checkin,
        checkout,
        apartmentId,
        roomsCount,
        guests,
        daysCount,
        setEmail,
        setCheckin,
        setCheckout,
        setGuests: (nextGuests) => {
            const maxGuests = roomsCount === 1 ? 2 : 4;
            setGuests(Math.min(nextGuests, maxGuests));
        },
        setApartment: (nextApartmentId, nextRoomsCount) => {
            setApartmentId(nextApartmentId);
            setRoomsCount(nextRoomsCount);
            setGuests((currentGuests) => Math.min(currentGuests, nextRoomsCount === 1 ? 2 : 4));
        },
        resetDates: () => {
            setCheckin(null);
            setCheckout(null);
        },
    }), [apartmentId, checkin, checkout, daysCount, email, guests, roomsCount]);

    return (
        <ReservationContext.Provider
            value={value}
        >
            {children}
        </ReservationContext.Provider>
    )
}

export const useReservation = () => {
    const context = useContext(ReservationContext);

    if (!context) {
        throw new Error("useReservation must be used within ReservationContextProvider");
    }

    return context;
};
