import { z } from "zod";
import type { AppNotification } from "@/interfaces";

const booleanFieldSchema = z
  .union([z.literal("0"), z.literal("1"), z.boolean()])
  .transform((value) => value === true || value === "1");

export const serviceDescriptionLocales = ["en", "fr", "de"] as const;

export type ServiceDescriptionLocale = (typeof serviceDescriptionLocales)[number];

export const serviceDescriptionLabels: Record<ServiceDescriptionLocale, string> = {
  en: "Anglais",
  fr: "Français",
  de: "Allemand",
};

const descriptionSchema = z
  .string()
  .min(1, "Saisissez une description.")
  .max(500, "Utilisez 500 caractères ou moins.");

export const serviceFormSchema = z.object({
  name: z.string().min(1, "Saisissez le nom du service.").max(30, "Utilisez 30 caractères ou moins."),
  price: z.coerce.number().min(0, "Le prix doit être supérieur ou égal à zéro."),
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
