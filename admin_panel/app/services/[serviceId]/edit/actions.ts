"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/auth/sessions";
import { getBackendApiBaseUrl, getBackendApiUrl } from "@/lib/api";
import { serviceFormSchema, type ServiceFormActionState } from "../../_sections/ServiceForm/ServiceForm.schema";

function getSelectedImage(formData: FormData) {
  const image = formData.get("images");

  return image instanceof File && image.size > 0 ? image : null;
}

async function readApiMessage(response: Response, fallback: string) {
  const payload = (await response.json().catch(() => null)) as {
    message?: string;
    res?: string;
  } | null;

  return payload?.res ?? payload?.message ?? fallback;
}

async function addServiceImage(
  apiUrl: string,
  serviceId: string,
  accessToken: string,
  image: File,
) {
  const payload = new FormData();
  payload.set("object_id", serviceId);
  payload.set("object_type", "service");
  payload.set("image", image);

  return fetch(`${apiUrl}/image-uploader`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: payload,
    cache: "no-store",
  });
}

async function deleteServiceImage(
  apiUrl: string,
  serviceId: string,
  accessToken: string,
  imageId: string,
) {
  const params = new URLSearchParams({
    object_id: serviceId,
    object_type: "service",
  });

  return fetch(`${apiUrl}/image-uploader/${imageId}?${params.toString()}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
}

export async function updateServiceAction(
  _previousState: ServiceFormActionState,
  formData: FormData,
): Promise<ServiceFormActionState> {
  const serviceId = String(formData.get("serviceId") ?? "");
  const deletedImageIds = formData
    .getAll("deleteImageIds")
    .map((imageId) => String(imageId))
    .filter(Boolean);
  const parsed = serviceFormSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    descriptions: {
      en: formData.get("descriptions[en]"),
      fr: formData.get("descriptions[fr]"),
      de: formData.get("descriptions[de]"),
    },
    visible: formData.get("visible"),
    fixed_price: formData.get("fixed_price"),
  });

  if (!serviceId) {
    return { message: "L'identifiant du service est manquant." };
  }

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    const formatted = parsed.error.format();

    return {
      fieldErrors: {
        name: flattened.name?.[0],
        price: flattened.price?.[0],
        descriptions: {
          en: formatted.descriptions?.en?._errors[0],
          fr: formatted.descriptions?.fr?._errors[0],
          de: formatted.descriptions?.de?._errors[0],
        },
        visible: flattened.visible?.[0],
        fixed_price: flattened.fixed_price?.[0],
      },
    };
  }

  const apiUrl = getBackendApiBaseUrl();

  if (!apiUrl) {
    return {
      message: "API_URL n'est pas configuré. Les données du formulaire sont valides.",
      notification: {
        id: "service-update-api-missing",
        status: "error",
        message: "Le service n'a pas été mis à jour.",
      },
    };
  }

  const session = await requireAdmin();

  try {
    const response = await fetch(getBackendApiUrl(`/services/${serviceId}`), {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        message: "Le service n'a pas été mis à jour. Vérifiez le formulaire et réessayez.",
        notification: {
          id: `service-update-${response.status}`,
          status: "error",
          message: "Le service n'a pas été mis à jour.",
        },
      };
    }

    const selectedImage = getSelectedImage(formData);

    for (const imageId of deletedImageIds) {
      const imageResponse = await deleteServiceImage(
        apiUrl,
        serviceId,
        session.accessToken,
        imageId,
      );

      if (!imageResponse.ok) {
        const message = await readApiMessage(imageResponse, "L'image du service n'a pas été supprimée.");

        return {
          message,
          notification: {
            id: `service-image-delete-${imageResponse.status}`,
            status: "error",
            message,
          },
        };
      }
    }

    if (selectedImage) {
      const imageResponse = await addServiceImage(
        apiUrl,
        serviceId,
        session.accessToken,
        selectedImage,
      );

      if (!imageResponse.ok) {
        const message = await readApiMessage(imageResponse, "L'image du service n'a pas été téléversée.");

        return {
          message,
          notification: {
            id: `service-image-add-${imageResponse.status}`,
            status: "error",
            message,
          },
        };
      }
    }
  } catch {
    return {
      message: "Impossible de joindre l'API.",
      notification: {
        id: "service-update-fetch-error",
        status: "error",
        message: "Impossible de joindre l'API.",
      },
    };
  }

  redirect("/services?notification=service-updated");
}
