import { z } from "zod";
import type { AppNotification } from "@/interfaces";

const booleanFieldSchema = z
  .union([z.literal("0"), z.literal("1"), z.boolean()])
  .transform((value) => value === true || value === "1");

export const serviceDescriptionLocales = ["en", "fr", "de"] as const;

export type ServiceDescriptionLocale = (typeof serviceDescriptionLocales)[number];

export const serviceDescriptionLabels: Record<ServiceDescriptionLocale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
};

const descriptionSchema = z
  .string()
  .min(1, "Enter a description.")
  .max(500, "Use 500 characters or fewer.");

export const serviceFormSchema = z.object({
  name: z.string().min(1, "Enter a service name.").max(30, "Use 30 characters or fewer."),
  price: z.coerce.number().min(0, "Price must be zero or higher."),
  descriptions: z.object({
    en: descriptionSchema,
    fr: descriptionSchema,
    de: descriptionSchema,
  }),
  visible: booleanFieldSchema,
  fixed_price: booleanFieldSchema,
});

export type ServiceDescriptionErrors = Partial<Record<ServiceDescriptionLocale, string>>;

export type ServiceFormActionState = {
  message?: string;
  notification?: AppNotification;
  fieldErrors?: Partial<
    Record<"name" | "price" | "visible" | "fixed_price" | "images", string>
  > & {
    descriptions?: ServiceDescriptionErrors;
  };
};

export type ServiceFormAction = (
  previousState: ServiceFormActionState,
  formData: FormData,
) => Promise<ServiceFormActionState>;
