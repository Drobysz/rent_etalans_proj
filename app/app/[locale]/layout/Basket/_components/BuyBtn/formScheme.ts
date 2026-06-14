import { z } from "zod";

const numberFromInput = (schema: z.ZodType<number>) =>
    z.preprocess(
        (value) => value === "" ? undefined : value,
        schema,
);

export const PurchaseScheme = z.object({
    email: z
        .email("Email is invalid")
        .min(1, { message: "Email is required" })
        .trim(),
    airbnb_code: z
        .string()
        .min(1, { message: "Reservation code is required" })
        .max(20)
        .trim(),
    days_count: numberFromInput(
        z.coerce.number({ message: "Days count is required" })
        .int()
        .min(0, { message: "Days count cannot be less then 1" })
    ),
    visitors_count: numberFromInput(
        z.coerce.number({ message: "Visitors count is required" })
        .int()
        .min(0, { message: "Visitors count cannot be less then 1" })
    ),
    services_ids: z
        .string()
        .transform((val)=> JSON.parse(val))
        .pipe(
            z.array((z.coerce.number()).min(1, {
                message: "Select at least one service"
            }))
        )
});

export type FormError = {
    email?: string;
    airbnb_code?: string;
    days_count?: string;
    visitors_count?: string;
}

export type FormState =
    {
        errors?: FormError,
        message?: string,
        success?: boolean
        invoice_url?: string;
    };
