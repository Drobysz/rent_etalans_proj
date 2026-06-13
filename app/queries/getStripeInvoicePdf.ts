export const getStripeInvoicePdf = async (sessionId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/stripe/invoice-pdf`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    console.error(error);
    throw new Error("Failed to get Stripe invoice PDF");
  }

  return res.json() as Promise<{
    invoice_pdf: string | null;
    hosted_invoice_url: string | null;
  }>;
};
