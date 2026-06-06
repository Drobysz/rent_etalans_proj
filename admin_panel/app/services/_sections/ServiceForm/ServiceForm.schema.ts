import { z } from "zod";
import type { AppNotification } from "@/interfaces";

const booleanFieldSchema = z
  .union([z.literal("0"), z.literal("1"), z.boolean()])
  .transform((value) => value === true || value === "1");

export const serviceFormSchema = z.object({
  name: z.string().min(1, "Enter a service name.").max(30, "Use 30 characters or fewer."),
  price: z.coerce.number().min(0, "Price must be zero or higher."),
  description: z.string().min(1, "Enter a description.").max(500, "Use 500 characters or fewer."),
  visible: booleanFieldSchema,
  fixed_price: booleanFieldSchema,
});

export type ServiceFormActionState = {
  message?: string;
  notification?: AppNotification;
  fieldErrors?: Partial<
    Record<"name" | "price" | "description" | "visible" | "fixed_price" | "images", string>
  >;
};

export type ServiceFormAction = (
  previousState: ServiceFormActionState,
  formData: FormData,
) => Promise<ServiceFormActionState>;
