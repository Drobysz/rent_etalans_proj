export interface PaymentInfoProps {
    email: string;
    reserve_id: string;
    duration: number;
    visitors_count: number;
    reservation?: {
        code?: string | null;
        apartment?: string;
        roomsCount?: number | null;
        guests?: number | null;
        checkin?: string | null;
        checkout?: string | null;
        nights?: number | null;
    };
}
