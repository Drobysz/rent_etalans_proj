"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/auth/sessions";
import { serviceFormSchema, type ServiceFormActionState } from "../_sections/ServiceForm/ServiceForm.schema";

export type CreateServiceActionState = ServiceFormActionState;

export async function createServiceAction(
  _previousState: CreateServiceActionState,
  formData: FormData,
): Promise<CreateServiceActionState> {
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
  const images = formData.getAll("images").filter((image) => image instanceof File && image.size > 0);

  if (!parsed.success || images.length === 0) {
    const flattened = parsed.success ? undefined : parsed.error.flatten().fieldErrors;
    const formatted = parsed.success ? undefined : parsed.error.format();

    return {
      fieldErrors: {
        name: flattened?.name?.[0],
        price: flattened?.price?.[0],
        descriptions: {
          en: formatted?.descriptions?.en?._errors[0],
          fr: formatted?.descriptions?.fr?._errors[0],
          de: formatted?.descriptions?.de?._errors[0],
        },
        visible: flattened?.visible?.[0],
        fixed_price: flattened?.fixed_price?.[0],
        images: images.length === 0 ? "Add an image." : undefined,
      },
    };
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return {
      message: "API_URL is not configured. The form data is valid.",
      notification: {
        id: "service-create-api-missing",
        status: "error",
        message: "Service was not created.",
      },
    };
  }

  const session = await requireAdmin();
  const payload = new FormData();
  payload.set("name", parsed.data.name);
  payload.set("price", String(parsed.data.price));
  payload.set("descriptions[en]", parsed.data.descriptions.en);
  payload.set("descriptions[fr]", parsed.data.descriptions.fr);
  payload.set("descriptions[de]", parsed.data.descriptions.de);
  payload.set("visible", parsed.data.visible ? "1" : "0");
  payload.set("fixed_price", parsed.data.fixed_price ? "1" : "0");
  images.forEach((image) => payload.append("images[]", image));

  try {
    const response = await fetch(`${apiUrl}/services`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: payload,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        message: "Service was not created. Check the form and try again.",
        notification: {
          id: `service-create-${response.status}`,
          status: "error",
          message: "Service was not created.",
        },
      };
    }
  } catch {
    return {
      message: "Unable to reach the API.",
      notification: {
        id: "service-create-fetch-error",
        status: "error",
        message: "Unable to reach the API.",
      },
    };
  }

  redirect("/services?notification=service-created");
}
