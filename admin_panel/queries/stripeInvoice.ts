import { getBackendApiUrl } from "@/lib/api";

export type StripeInvoicePdfResponse = {
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
};

export async function getStripeInvoicePdf(
  sessionId: string,
): Promise<StripeInvoicePdfResponse> {
  const apiUrl = getBackendApiUrl("/stripe/invoice-pdf");

  if (!apiUrl) {
    throw new Error("API_URL n'est pas configuré.");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error("Impossible de charger le reçu Stripe.");
  }

  return response.json() as Promise<StripeInvoicePdfResponse>;
}
