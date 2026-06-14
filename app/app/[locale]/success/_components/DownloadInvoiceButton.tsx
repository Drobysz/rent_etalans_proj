"use client";

import { createInvoicePdf } from "@/utils/createInvoicePdf";
import type { InvoiceServiceItem } from "@/utils/createInvoicePdf";
import { useTranslations } from "next-intl";

type DownloadInvoiceButtonProps = {
  email: string;
  reserveId: string;
  daysNumber: number;
  visitorsNumber: number;
  totalPrice: number;
  services: InvoiceServiceItem[];
};

export const DownloadInvoiceButton = ({
  email,
  reserveId,
  daysNumber,
  visitorsNumber,
  totalPrice,
  services,
}: DownloadInvoiceButtonProps) => {
  const t = useTranslations("success");

  const handleDownload = () => {
    const pdf = createInvoicePdf({
      email,
      reserveId,
      daysNumber,
      visitorsNumber,
      totalPrice,
      services,
      paidAt: new Date().toISOString(),
      receiptNumber: reserveId,
    });

    pdf.save(`invoice-${reserveId}.pdf`);
  };

  return (
    <button type="button" onClick={handleDownload}>
      {t("downloadCustomInvoice")}
    </button>
  );
};
