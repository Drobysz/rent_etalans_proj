export async function getServiceResult(reserve_id: string, page: number) {
    const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments?page=${page}&reserve_id=${reserve_id}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            signal: controller.signal,
        });

        if (!res.ok) {
            console.error(res.statusText)
            throw new Error(`Failed to fetch services result: ${res.status} ${res.statusText}`);
        }

        const payload = await res.json();

        return payload;

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