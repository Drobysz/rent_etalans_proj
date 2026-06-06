import { getSession } from "@/auth/sessions";
import type { Service } from "@/interfaces";
import type { AppNotification } from "@/interfaces";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export const mockServices: Service[] = [
  {
    id: "svc-cleaning",
    name: "Mid-stay cleaning",
    description: "Cleaning visit for active stays, including linen refresh.",
    price: 49,
    status: "active",
    updatedAt: "2026-06-03T09:40:00.000Z",
    images: [],
    visible: true,
    fixedPrice: true,
  },
  {
    id: "svc-transfer",
    name: "Airport transfer",
    description: "Scheduled private transfer between airport and apartment.",
    price: 72,
    status: "active",
    updatedAt: "2026-06-02T14:15:00.000Z",
    images: [],
    visible: true,
    fixedPrice: false,
  },
  {
    id: "svc-breakfast",
    name: "Breakfast delivery",
    description: "Morning delivery from partner bakery for the full stay.",
    price: 18,
    status: "draft",
    updatedAt: "2026-05-28T07:30:00.000Z",
    images: [],
    visible: false,
    fixedPrice: true,
  },
];

type ApiService = {
  id: number | string;
  name: string;
  description: string;
  price: number | string;
  visible?: boolean | number | string;
  fixed_price?: boolean | number | string;
  images?: Array<{
    id: number | string;
    filename: string;
    path: string;
    url: string;
  }>;
};

function mapBoolean(value: ApiService["visible"], fallback = false) {
  if (value === undefined) {
    return fallback;
  }

  return value === true || value === 1 || value === "1";
}

function mapService(service: ApiService): Service {
  const visible = mapBoolean(service.visible, true);

  return {
    id: String(service.id),
    name: service.name,
    description: service.description,
    price: Number(service.price),
    status: visible ? "active" : "draft",
    updatedAt: new Date().toISOString(),
    visible,
    fixedPrice: mapBoolean(service.fixed_price),
    images: (service.images ?? []).map((image) => ({
      id: String(image.id),
      filename: image.filename,
      path: image.path,
      url: image.url,
    })),
  };
}

export type ServicesQueryResult = {
  notification?: AppNotification;
  services: Service[];
};

export async function getServices(): Promise<ServicesQueryResult> {
  if (!API_URL) {
    return {
      services: mockServices,
      notification: {
        id: "services-api-missing",
        status: "error",
        message: "API_URL is not configured.",
      },
    };
  }

  const session = await getSession();

  if (!session?.accessToken) {
    return {
      services: [],
      notification: {
        id: "services-session-missing",
        status: "error",
        message: "Admin session is required to load services.",
      },
    };
  }

  try {
    const response = await fetch(`${API_URL}/services`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        services: [],
        notification: {
          id: `services-fetch-${response.status}`,
          status: "error",
          message: "Unable to load services.",
        },
      };
    }

    const payload = (await response.json()) as { data?: ApiService[] };
    const services = payload.data ?? [];

    return { services: services.map(mapService) };
  } catch {
    return {
      services: [],
      notification: {
        id: "services-fetch-error",
        status: "error",
        message: "Unable to reach the API.",
      },
    };
  }
}

export async function getService(serviceId: string): Promise<Service | null> {
  if (!API_URL) {
    return mockServices.find((service) => service.id === serviceId) ?? null;
  }

  const session = await getSession();

  if (!session?.accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/services/${serviceId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
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
