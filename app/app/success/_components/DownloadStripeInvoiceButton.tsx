"use client";

import { useState } from "react";
import { getStripeInvoicePdf } from "@/queries/getStripeInvoicePdf";

type DownloadStripeInvoiceButtonProps = {
  sessionId: string;
};

export const DownloadStripeInvoiceButton = ({
  sessionId,
}: DownloadStripeInvoiceButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const data = await getStripeInvoicePdf(sessionId);

      if (!data.invoice_pdf) {
        throw new Error("Stripe invoice PDF is not ready yet");
      }

      window.open(data.invoice_pdf, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleDownload} disabled={loading}>
      {loading ? "Loading..." : "Download Stripe invoice"}
    </button>
  );
};
