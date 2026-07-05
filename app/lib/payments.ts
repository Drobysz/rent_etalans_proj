"use server"

import { cookies } from 'next/headers';
import { Apartment, Payment, Service } from '@/types';
import { getBackendApiUrl } from './api';

// Encryption
import { encrypt, decrypt } from './encrypt';

function getPaymentCodes(payment: Payment) {
    return [
        payment.reservation_code,
        payment.reservation?.reservation_code,
        payment.reserve_id,
    ].filter(Boolean).map(String);
}

function isSamePayment(left: Payment, right: Payment) {
    if (left.session_id && right.session_id) {
        return left.session_id === right.session_id;
    }

    const leftCodes = getPaymentCodes(left);
    const rightCodes = getPaymentCodes(right);

    if (leftCodes.some((code) => rightCodes.includes(code))) {
        return true;
    }

    if (left.id && right.id) {
        return String(left.id) === String(right.id);
    }

    return false;
}

function getLookupCode(payment: Payment) {
    return getPaymentCodes(payment)[0] ?? null;
}

function compactApartment(apartment?: Apartment | null): Apartment | null {
    if (!apartment) {
        return null;
    }

    return {
        id: apartment.id,
        name: apartment.name,
        price: apartment.price,
        description: apartment.description ?? "",
        nb_beds: apartment.nb_beds,
        nb_chambers: apartment.nb_chambers,
        apart_link: apartment.apart_link ?? "/housing/reservation",
    };
}

function compactService(service: Service): Service {
    return {
        id: service.id,
        name: service.name,
        description: service.description ?? "",
        visible: service.visible ?? true,
        fixed_price: service.fixed_price ?? false,
        price: service.price,
        images: [],
    };
}

function normalizePaymentForStorage(payment: Payment): Payment {
    const reservation = payment.reservation;
    const apartment = compactApartment(reservation?.apartment ?? payment.apartment);
    const reservationApartment = compactApartment(reservation?.apartment ?? apartment);

    return {
        id: payment.id,
        email: payment.email,
        reserve_id: payment.reserve_id,
        total_price: payment.total_price,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
        session_id: payment.session_id,
        reservation_id: payment.reservation_id ?? reservation?.id ?? null,
        reservation_code: payment.reservation_code ?? reservation?.reservation_code ?? null,
        apart_id: payment.apart_id ?? apartment?.id ?? null,
        days_number: payment.days_number,
        checkin: payment.checkin ?? reservation?.checkin ?? null,
        checkout: payment.checkout ?? reservation?.checkout ?? null,
        days_count: payment.days_count ?? reservation?.days_count ?? payment.days_number,
        client_number: payment.client_number ?? reservation?.guests,
        services: payment.services?.map(compactService) ?? [],
        apartment,
        reservation: reservation
            ? {
                id: reservation.id,
                reservation_code: reservation.reservation_code ?? payment.reservation_code ?? null,
                checkin: reservation.checkin ?? payment.checkin ?? null,
                checkout: reservation.checkout ?? payment.checkout ?? null,
                days_count: reservation.days_count ?? payment.days_count ?? payment.days_number,
                rooms_count: reservation.rooms_count ?? apartment?.nb_chambers,
                guests: reservation.guests ?? payment.client_number,
                status: reservation.status,
                apartment: reservationApartment,
            }
            : reservation,
    };
}

function mergePayments(storedPayment: Payment, incomingPayment: Payment): Payment {
    const stored = normalizePaymentForStorage(storedPayment);
    const incoming = normalizePaymentForStorage(incomingPayment);
    const reservation = incoming.reservation ?? stored.reservation ?? null;
    const apartment = incoming.apartment
        ?? reservation?.apartment
        ?? stored.apartment
        ?? null;

    return normalizePaymentForStorage({
        ...stored,
        ...incoming,
        services: incoming.services?.length ? incoming.services : stored.services,
        reservation,
        apartment,
    });
}

async function fetchStoredPayment(payment: Payment) {
    const lookupCode = getLookupCode(payment);

    if (!lookupCode) {
        return normalizePaymentForStorage(payment);
    }

    const params = new URLSearchParams({
        reserve_id: lookupCode,
        sort: "desc",
    });
    const apiUrl = getBackendApiUrl(`/payments?${params.toString()}`);

    if (!apiUrl) {
        return payment;
    }

    try {
        const res = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            return normalizePaymentForStorage(payment);
        }

        const payload = await res.json();
        const backendPayments = (payload?.data ?? []) as Payment[];

        const backendPayment = backendPayments.find((paymentFromBackend) => isSamePayment(paymentFromBackend, payment))
            ?? backendPayments[0]
            ?? payment;

        return mergePayments(payment, backendPayment);
    } catch (error) {
        console.error("Unable to refresh stored payment", error);

        return normalizePaymentForStorage(payment);
    }
}

async function setPaymentsStorage(paymentsList: Payment[]) {
    const expiresAt = new Date(Date.now() + 1000 * 365 * 24 * 60 * 60 * 60); // 365 days
    const payments = await encrypt({
        payments: paymentsList.map(normalizePaymentForStorage),
    });
    const paymentsStore = await cookies();

    paymentsStore.set("rent_payments", payments, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: expiresAt,
        path: "/"
    });
}

export async function createPaymentsStorage(payment: Payment) {
    await setPaymentsStorage([payment]);
};

export async function addToPaymentStorage (payment: Payment) {
    const paymentsStore = await cookies();
    const hashed_value = paymentsStore.get("rent_payments");
    const normalizedPayment = normalizePaymentForStorage(payment);

    if (!hashed_value?.value) {
        await createPaymentsStorage(normalizedPayment);
    } else {
        const paymentsObj = await decrypt(hashed_value?.value);
        const storedPayments = (paymentsObj?.payments ?? []).map(normalizePaymentForStorage);
        const existingIndex = storedPayments.findIndex((storedPayment) => (
            isSamePayment(storedPayment, normalizedPayment)
        ));

        if (existingIndex >= 0) {
            storedPayments[existingIndex] = mergePayments(storedPayments[existingIndex], normalizedPayment);
        } else {
            storedPayments.push(normalizedPayment);
        }

        await setPaymentsStorage(storedPayments);
    }
}

export async function getPayments() {
    const sesstionStore = await cookies();

    const hashed_value = sesstionStore.get("rent_payments");

    if (!hashed_value?.value) {
        return [];
    }

    const paymentsObj = await decrypt(hashed_value?.value);
    const payments = paymentsObj?.payments;
    
    return payments?.map(normalizePaymentForStorage) ?? [];
};

export async function getHydratedPayments() {
    const storedPayments = await getPayments();
    const hydratedPayments = await Promise.all(
        storedPayments.map((payment: Payment) => fetchStoredPayment(payment))
    );

    const uniquePayments = hydratedPayments.reduce<Payment[]>((result, payment) => {
        if (!result.some((storedPayment) => isSamePayment(storedPayment, payment))) {
            result.push(payment);
        }

        return result;
    }, []);

    const hasChanged = uniquePayments.length !== storedPayments.length
        || uniquePayments.some((payment, index) => (
            JSON.stringify(payment) !== JSON.stringify(storedPayments[index])
        ));

    if (hasChanged) {
        await setPaymentsStorage(uniquePayments);
    }

    return uniquePayments;
};
