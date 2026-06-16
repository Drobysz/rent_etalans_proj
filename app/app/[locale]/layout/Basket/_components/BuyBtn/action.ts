"use server";

import { createInvoice } from "@/queries/createInvoice";
import { FormState, PurchaseScheme } from "./formScheme";
import { z } from "zod";

export async function purchaseAction (_: FormState, formData: FormData) {
    const parsed = PurchaseScheme.safeParse({
        email: formData.get("email"),
        airbnb_code: formData.get("airbnb_code"),
        days_count: formData.get("days_count"),
        visitors_count: formData.get("visitors_count"),
        services_ids: formData.get("services_ids")
    });

    if (!parsed.success) {
        const errors = z.flattenError(parsed.error).fieldErrors;

        return {
            success: false,
            message: "Form was incorrectly filled",
            errors: {
                email: errors.email?.[0],
                airbnb_code: errors.airbnb_code?.[0],
                days_count: errors.days_count?.[0],
                visitors_count: errors.visitors_count?.[0],
                services_ids: errors.services_ids?.[0]
            }
        }
    }

    const res = await createInvoice(
        parsed.data.email,
        parsed.data.airbnb_code,
        parsed.data.visitors_count,
        parsed.data.days_count,
        parsed.data.services_ids
    );

    return { 
        success: true,
        invoice_url: res.invoice_url,
        message: res.message
    }
}

