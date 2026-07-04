export type ReservationState = {
    email: string;
    checkin: string | null;
    checkout: string | null;
    apartmentId: number | null;
    roomsCount: 1 | 2;
    guests: number;
    daysCount: number;
};

export type ReservationContextValue = ReservationState & {
    setEmail: (email: string) => void;
    setCheckin: (checkin: string | null) => void;
    setCheckout: (checkout: string | null) => void;
    setApartment: (apartmentId: number | null, roomsCount: 1 | 2) => void;
    setGuests: (guests: number) => void;
    resetDates: () => void;
};
