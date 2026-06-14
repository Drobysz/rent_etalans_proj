export async function getServices() {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
        const res = await fetch(`${apiUrl}/services/visible`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            next: {
                revalidate: 3600
            },
            signal: controller.signal,
        });

        if (!res.ok) {
            console.error(res.statusText)
            throw new Error(`Failed to fetch services: ${res.status} ${res.statusText}`);
        }

        const data = await res.json().catch(()=> null);
        return data.data;

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
