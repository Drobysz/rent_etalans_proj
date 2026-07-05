export const RESERVATION_CHECKIN_TIME = "17:00";
export const RESERVATION_CHECKOUT_TIME = "10:00";

function formatDate(date: string | null | undefined) {
    if (!date) {
        return null;
    }

    const [year, month, day] = date.split("-");

    if (!year || !month || !day) {
        return date;
    }

    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

export function formatReservationCheckin(date: string | null | undefined) {
    const formattedDate = formatDate(date);

    return formattedDate ? `${formattedDate} — ${RESERVATION_CHECKIN_TIME}` : null;
}

export function formatReservationCheckout(date: string | null | undefined) {
    const formattedDate = formatDate(date);

    return formattedDate ? `${formattedDate} — ${RESERVATION_CHECKOUT_TIME}` : null;
}
