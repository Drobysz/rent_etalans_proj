export type ValidatedPaymentData = {
    email: string;
    reserve_id: string;
    client_number: number;
    days_number: number;
    total_price: number;
    service_ids: number[];
};

export type ValidatePaymentResult = {
    valid: boolean;
    payment_status?: string;
    payment?: ValidatedPaymentData;
};

export async function validatePayment (session_id: string): Promise<ValidatePaymentResult> {
    const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validate-purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                session_id: session_id
            }),
            signal: controller.signal,
        });

        if (!res.ok) {
            console.error(res.statusText)
            throw new Error(`Failed to fetch services result: ${res.status} ${res.statusText}`);
        }

        const payload = await res.json();
        console.log("Payload:", payload)

        return {
            valid: payload.valid ?? false,
            payment_status: payload.payment_status,
            payment: payload.payment,
        };

    } catch (error){
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("Services request timeout");
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error("Unknown error while fetching services");
    } finally {
        clearTimeout(timeoutId);
    }
}
