import type { Service } from "@/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const mockServices: Service[] = [
  {
    id: "svc-cleaning",
    name: "Mid-stay cleaning",
    description: "Cleaning visit for active stays, including linen refresh.",
    price: 49,
    status: "active",
    updatedAt: "2026-06-03T09:40:00.000Z",
    images: [],
  },
  {
    id: "svc-transfer",
    name: "Airport transfer",
    description: "Scheduled private transfer between airport and apartment.",
    price: 72,
    status: "active",
    updatedAt: "2026-06-02T14:15:00.000Z",
    images: [],
  },
  {
    id: "svc-breakfast",
    name: "Breakfast delivery",
    description: "Morning delivery from partner bakery for the full stay.",
    price: 18,
    status: "draft",
    updatedAt: "2026-05-28T07:30:00.000Z",
    images: [],
  },
];

type ApiService = {
  id: number | string;
  name: string;
  description: string;
  price: number | string;
  images?: Array<{
    id: number | string;
    filename: string;
    path: string;
    url: string;
  }>;
};

function mapService(service: ApiService): Service {
  return {
    id: String(service.id),
    name: service.name,
    description: service.description,
    price: Number(service.price),
    status: "active",
    updatedAt: new Date().toISOString(),
    images: (service.images ?? []).map((image) => ({
      id: String(image.id),
      filename: image.filename,
      path: image.path,
      url: image.url,
    })),
  };
}

export async function getServices(): Promise<Service[]> {
  if (!API_URL) {
    return mockServices;
  }

  try {
    const response = await fetch(`${API_URL}/services`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return mockServices;
    }

    const payload = (await response.json()) as { data?: ApiService[] };
    const services = payload.data ?? [];

    return services.map(mapService);
  } catch {
    return mockServices;
  }
}

export async function getService(serviceId: string): Promise<Service | null> {
  if (!API_URL) {
    return mockServices.find((service) => service.id === serviceId) ?? null;
  }

  try {
    const response = await fetch(`${API_URL}/services/${serviceId}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { data?: ApiService };

    return payload.data ? mapService(payload.data) : null;
  } catch {
    return null;
  }
}
