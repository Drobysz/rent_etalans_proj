export const createPayment = async (
    email: string,
    reserve_id: string,
    client_number: number,
    days_number: number,
    total_price: number,
    service_ids: number[]
)=> {
    const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
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
                service_ids: service_ids,
                total_price: total_price
            }),
            signal: controller.signal,
        });

        console.log(res)

        if (!res.ok) {
            console.error(res.statusText)
            throw new Error(`Failed to create invoice: ${res.status} ${res.statusText}`);
        }

        return res.ok;

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