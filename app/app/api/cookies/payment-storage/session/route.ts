import { addToPaymentStorage } from "@/lib/payments";
import { getBackendApiUrl } from "@/lib/api";
import type { Payment } from "@/types";
import { NextRequest, NextResponse } from "next/server";

async function getValidatedPayment(sessionId: string): Promise<Payment | null> {
    const res = await fetch(getBackendApiUrl("/validate-purchase"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            session_id: sessionId,
        }),
        cache: "no-store",
    });

    if (!res.ok) {
        return null;
    }

    const payload = await res.json();

    if (!payload?.valid || !payload?.payment) {
        return null;
    }

    return {
        id: sessionId,
        ...payload.payment,
        session_id: sessionId,
    };
}

async function getBackendPayment(payment: Payment): Promise<Payment | null> {
    const lookupCode = payment.reservation_code ?? payment.reserve_id;

    if (!lookupCode) {
        return null;
    }

    const params = new URLSearchParams({
        reserve_id: String(lookupCode),
        sort: "desc",
    });
    const res = await fetch(getBackendApiUrl(`/payments?${params.toString()}`), {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        return null;
    }

    const payload = await res.json();
    const payments = (payload?.data ?? []) as Payment[];

    return payments.find((backendPayment) => backendPayment.session_id === payment.session_id)
        ?? payments[0]
        ?? null;
}

export async function GET(request: NextRequest) {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    const validatedPayment = await getValidatedPayment(sessionId);

    if (!validatedPayment) {
        return NextResponse.json({ ok: false }, { status: 404 });
    }

    const payment = await getBackendPayment(validatedPayment) ?? validatedPayment;

    await addToPaymentStorage(payment);

    return NextResponse.json({
        ok: true,
        payment,
    });
}
