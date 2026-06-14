const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

export type StripeInvoicePdfResponse = {
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
};

export async function getStripeInvoicePdf(
  sessionId: string,
): Promise<StripeInvoicePdfResponse> {
  if (!API_URL) {
    throw new Error("API_URL is not configured.");
  }

  const response = await fetch(`${API_URL}/stripe/invoice-pdf`, {
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
    throw new Error("Unable to load Stripe receipt.");
  }

  return response.json() as Promise<StripeInvoicePdfResponse>;
}
