import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z.string().min(1, "Enter a service name.").max(30, "Use 30 characters or fewer."),
  price: z.coerce.number().min(0, "Price must be zero or higher."),
  description: z.string().min(1, "Enter a description.").max(500, "Use 500 characters or fewer."),
});

export type ServiceFormActionState = {
  message?: string;
  fieldErrors?: Partial<Record<"name" | "price" | "description" | "images", string>>;
};

export type ServiceFormAction = (
  previousState: ServiceFormActionState,
  formData: FormData,
) => Promise<ServiceFormActionState>;
