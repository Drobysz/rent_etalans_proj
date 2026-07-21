"use client";

import { createInvoicePdf } from "@/utils/createInvoicePdf";
import type {
  InvoiceApartmentItem,
  InvoiceServiceItem,
  InvoiceTouristTaxItem,
} from "@/utils/createInvoicePdf";
import { useTranslations } from "next-intl";

type DownloadInvoiceButtonProps = {
  email: string;
  reserveId: string;
  daysNumber: number;
  visitorsNumber: number;
  totalPrice: number;
  services: InvoiceServiceItem[];
  apartment?: InvoiceApartmentItem;
  touristTax?: InvoiceTouristTaxItem;
};

export const DownloadInvoiceButton = ({
  email,
  reserveId,
  daysNumber,
  visitorsNumber,
  totalPrice,
  services,
  apartment,
  touristTax,
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
      apartment,
      touristTax,
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
