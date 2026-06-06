"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const createServiceSchema = z.object({
  name: z.string().min(1, "Enter a service name.").max(30, "Use 30 characters or fewer."),
  price: z.coerce.number().min(0, "Price must be zero or higher."),
  description: z.string().min(1, "Enter a description.").max(500, "Use 500 characters or fewer."),
});

export type CreateServiceActionState = {
  message?: string;
  fieldErrors?: Partial<Record<"name" | "price" | "description" | "images", string>>;
};

export async function createServiceAction(
  _previousState: CreateServiceActionState,
  formData: FormData,
): Promise<CreateServiceActionState> {
  const parsed = createServiceSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    description: formData.get("description"),
  });
  const images = formData.getAll("images").filter((image) => image instanceof File && image.size > 0);

  if (!parsed.success || images.length === 0) {
    const flattened = parsed.success ? undefined : parsed.error.flatten().fieldErrors;

    return {
      fieldErrors: {
        name: flattened?.name?.[0],
        price: flattened?.price?.[0],
        description: flattened?.description?.[0],
        images: images.length === 0 ? "Add an image." : undefined,
      },
    };
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return { message: "API_URL is not configured. The form data is valid." };
  }

  const payload = new FormData();
  payload.set("name", parsed.data.name);
  payload.set("price", String(parsed.data.price));
  payload.set("description", parsed.data.description);
  images.forEach((image) => payload.append("images[]", image));

  try {
    const response = await fetch(`${apiUrl}/services`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: payload,
      cache: "no-store",
    });

    if (!response.ok) {
      return { message: "Service was not created. Check the form and try again." };
    }
  } catch {
    return { message: "Unable to reach the API." };
  }

  redirect("/admin_panel/services");
}
