export async function validatePayment (session_id: string) {
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
        const valid = payload.valid ?? false;

        return valid;

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