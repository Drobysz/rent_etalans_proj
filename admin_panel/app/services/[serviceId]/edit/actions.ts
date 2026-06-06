"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/auth/sessions";
import { serviceFormSchema, type ServiceFormActionState } from "../../_sections/ServiceForm/ServiceForm.schema";

function getSelectedImage(formData: FormData) {
  const image = formData.get("images");

  return image instanceof File && image.size > 0 ? image : null;
}

async function updateServiceImage(
  apiUrl: string,
  serviceId: string,
  currentImageId: string | null,
  image: File,
) {
  const payload = new FormData();
  payload.set("object_id", serviceId);
  payload.set("object_type", "service");

  if (currentImageId) {
    payload.set("_method", "PATCH");
    payload.set("new_image", image);

    return fetch(`${apiUrl}/image-uploader/${currentImageId}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: payload,
      cache: "no-store",
    });
  }

  payload.set("image", image);

  return fetch(`${apiUrl}/image-uploader`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: payload,
    cache: "no-store",
  });
}

export async function updateServiceAction(
  _previousState: ServiceFormActionState,
  formData: FormData,
): Promise<ServiceFormActionState> {
  const serviceId = String(formData.get("serviceId") ?? "");
  const currentImageId = formData.get("currentImageId");
  const parsed = serviceFormSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    description: formData.get("description"),
    visible: formData.get("visible"),
    fixed_price: formData.get("fixed_price"),
  });

  if (!serviceId) {
    return { message: "Service id is missing." };
  }

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;

    return {
      fieldErrors: {
        name: flattened.name?.[0],
        price: flattened.price?.[0],
        description: flattened.description?.[0],
        visible: flattened.visible?.[0],
        fixed_price: flattened.fixed_price?.[0],
      },
    };
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return {
      message: "API_URL is not configured. The form data is valid.",
      notification: {
        id: "service-update-api-missing",
        status: "error",
        message: "Service was not updated.",
      },
    };
  }

  const session = await requireAdmin();

  try {
    const response = await fetch(`${apiUrl}/services/${serviceId}`, {
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
        message: "Service was not updated. Check the form and try again.",
        notification: {
          id: `service-update-${response.status}`,
          status: "error",
          message: "Service was not updated.",
        },
      };
    }

    const selectedImage = getSelectedImage(formData);

    if (selectedImage) {
      const imageResponse = await updateServiceImage(
        apiUrl,
        serviceId,
        typeof currentImageId === "string" ? currentImageId : null,
        selectedImage,
      );

      if (!imageResponse.ok) {
        return {
          message: "Service details were saved, but the image was not updated.",
          notification: {
            id: `service-image-update-${imageResponse.status}`,
            status: "error",
            message: "Service image was not updated.",
          },
        };
      }
    }
  } catch {
    return {
      message: "Unable to reach the API.",
      notification: {
        id: "service-update-fetch-error",
        status: "error",
        message: "Unable to reach the API.",
      },
    };
  }

  redirect("/services?notification=service-updated");
}
