import { getBackendApiUrl } from "@/lib/api";

export const createInvoice = async (
    email: string,
    reserve_id: string,
    client_number: number,
    days_number: number,
    service_ids: number[]
)=> {
    const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
        const res = await fetch(getBackendApiUrl("/create-checkout-session"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: email,
                reserve_id: reserve_id,
                client_number: client_number,
                days_number: days_number,
                service_ids: service_ids
            }),
            signal: controller.signal,
        });

        if (!res.ok) {
            console.error(res.statusText)
            throw new Error(`Failed to create invoice: ${res.status} ${res.statusText}`);
        }

        const payload = await res.json();
        const invoice_url = payload.url ?? "#";

        return {
            message: "Invoice was created",
            invoice_url: invoice_url
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
