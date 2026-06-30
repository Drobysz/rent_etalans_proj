"use server"

import { cookies } from 'next/headers';
import { Payment } from '@/types';

// Encryption
import { encrypt, decrypt } from './encrypt';

function isSamePayment(left: Payment, right: Payment) {
    if (left.session_id && right.session_id) {
        return left.session_id === right.session_id;
    }

    if (left.id && right.id) {
        return String(left.id) === String(right.id);
    }

    return Boolean(left.reserve_id && left.reserve_id === right.reserve_id);
}

export async function createPaymentsStorage(payment: Payment) {
    const expiresAt = new Date(Date.now() + 1000 * 365 * 24 * 60 * 60 * 60); // 365 days
    const paymentsObj = { payments: [ payment ] };
    const payments = await encrypt(paymentsObj);

    const paymentsStore = await cookies();

    paymentsStore.set("rent_payments", payments, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: expiresAt,
        path: "/"
    });
};

export async function addToPaymentStorage (payment: Payment) {
    const paymentsStore = await cookies();
    const hashed_value = paymentsStore.get("rent_payments");

    if (!hashed_value?.value) {
        await createPaymentsStorage(payment);
    } else {
        const expiresAt = new Date(Date.now() + 1000 * 365 * 24 * 60 * 60 * 60); // 365 days
        const paymentsObj = await decrypt(hashed_value?.value);
        const storedPayments = paymentsObj?.payments ?? [];
        const newPaymentsObj = {
            payments: storedPayments.some((storedPayment) => isSamePayment(storedPayment, payment))
                ? storedPayments
                : [ ...storedPayments, payment ]
        };
        const payments = await encrypt(newPaymentsObj);

        paymentsStore.set("rent_payments", payments, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            expires: expiresAt,
            path: "/"
        });
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
    
    return payments ?? [];
};
