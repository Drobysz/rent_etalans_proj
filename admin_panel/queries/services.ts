import { getSession } from "@/auth/sessions";
import type { Service } from "@/interfaces";
import type { AppNotification } from "@/interfaces";
import { getBackendApiUrl } from "@/lib/api";

export const mockServices: Service[] = [
  {
    id: "svc-cleaning",
    name: "Ménage en cours de séjour",
    description: "Passage de ménage pendant les séjours actifs, avec linge rafraîchi.",
    descriptions: [
      { locale: "en", description: "Cleaning visit for active stays, including linen refresh." },
      { locale: "fr", description: "Passage de ménage pendant le séjour, avec linge rafraîchi." },
      { locale: "de", description: "Reinigung während des Aufenthalts, inklusive frischer Wäsche." },
    ],
    price: 49,
    status: "active",
    updatedAt: "2026-06-03T09:40:00.000Z",
    images: [],
    visible: true,
    fixedPrice: true,
  },
  {
    id: "svc-transfer",
    name: "Transfert aéroport",
    description: "Transfert privé planifié entre l'aéroport et l'appartement.",
    descriptions: [
      { locale: "en", description: "Scheduled private transfer between airport and apartment." },
      { locale: "fr", description: "Transfert privé planifié entre l'aéroport et l'appartement." },
      { locale: "de", description: "Geplanter privater Transfer zwischen Flughafen und Apartment." },
    ],
    price: 72,
    status: "active",
    updatedAt: "2026-06-02T14:15:00.000Z",
    images: [],
    visible: true,
    fixedPrice: false,
  },
  {
    id: "svc-breakfast",
    name: "Livraison du petit-déjeuner",
    description: "Livraison matinale depuis la boulangerie partenaire pour tout le séjour.",
    descriptions: [
      { locale: "en", description: "Morning delivery from partner bakery for the full stay." },
      { locale: "fr", description: "Livraison matinale depuis la boulangerie partenaire pour tout le séjour." },
      { locale: "de", description: "Morgendliche Lieferung von der Partnerbäckerei für den gesamten Aufenthalt." },
    ],
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
  descriptions?: Array<{
    locale: "en" | "fr" | "de";
    description: string;
  }>;
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
    descriptions: service.descriptions ?? [],
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
  const apiUrl = getBackendApiUrl("/services");

  if (!apiUrl) {
    return {
      services: mockServices,
      notification: {
        id: "services-api-missing",
        status: "error",
        message: "API_URL n'est pas configuré.",
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
        message: "Une session admin est requise pour charger les services.",
      },
    };
  }

  try {
    const response = await fetch(apiUrl, {
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
          message: "Impossible de charger les services.",
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
        message: "Impossible de joindre l'API.",
      },
    };
  }
}

export async function getService(serviceId: string): Promise<Service | null> {
  const apiUrl = getBackendApiUrl(`/services/${serviceId}`);

  if (!apiUrl) {
    return mockServices.find((service) => service.id === serviceId) ?? null;
  }

  const session = await getSession();

  if (!session?.accessToken) {
    return null;
  }

  try {
    const response = await fetch(apiUrl, {
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
