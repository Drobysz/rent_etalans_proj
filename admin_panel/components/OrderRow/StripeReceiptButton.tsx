"use client";

import { useState } from "react";
import { getStripeInvoicePdf } from "@/queries/stripeInvoice";
import styles from "./style.module.scss";

type StripeReceiptButtonProps = {
  sessionId?: string;
};

export function StripeReceiptButton({ sessionId }: StripeReceiptButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!sessionId || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const invoice = await getStripeInvoicePdf(sessionId);
      const invoiceUrl = invoice.invoice_pdf ?? invoice.hosted_invoice_url;

      if (!invoiceUrl) {
        return;
      }

      window.open(invoiceUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={styles.stripeButton}
      type="button"
      onClick={handleClick}
      disabled={!sessionId || isLoading}
      title={sessionId ? "Ouvrir le reçu Stripe" : "Le reçu Stripe est indisponible"}
    >
      {isLoading ? "Chargement" : "Reçu Stripe"}
    </button>
  );
}
