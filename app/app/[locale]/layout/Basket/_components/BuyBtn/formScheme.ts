import { z } from "zod";

const numberFromInput = (schema: z.ZodType<number>) =>
    z.preprocess(
        (value) => value === "" ? undefined : value,
        schema,
);

export const PurchaseScheme = z.object({
    email: z
        .email("emailInvalid")
        .min(1, { message: "emailRequired" })
        .trim(),
    airbnb_code: z
        .string()
        .min(1, { message: "reservationCodeRequired" })
        .max(20, { message: "reservationCodeMax" })
        .trim(),
    days_count: numberFromInput(
        z.coerce.number({ message: "daysCountRequired" })
        .int()
        .min(1, { message: "daysCountMin" })
    ),
    visitors_count: numberFromInput(
        z.coerce.number({ message: "visitorsCountRequired" })
        .int()
        .min(1, { message: "visitorsCountMin" })
    ),
    services_ids: z
        .string()
        .transform((val)=> JSON.parse(val))
        .pipe(
            z.array((z.coerce.number()).min(1, {
                message: "serviceRequired"
            }))
        )
});

export type FormError = {
    email?: string;
    airbnb_code?: string;
    days_count?: string;
    visitors_count?: string;
    services_ids?: string;
}

export type FormState =
    {
        errors?: FormError,
        message?: string,
        success?: boolean
        invoice_url?: string;
    };
