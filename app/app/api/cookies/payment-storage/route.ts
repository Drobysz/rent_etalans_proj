import { addToPaymentStorage, getPayments } from "@/lib/payments";
import { Payment } from "@/types";
import { NextResponse } from "next/server";

export async function GET () {
    const payments = await getPayments();

    return NextResponse.json({ payments });
}

export async function POST (req: Request) {
    const payment: Payment = await req.json();

    if (!payment) {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    await addToPaymentStorage(payment);

    return NextResponse.json({ ok: true });
}
