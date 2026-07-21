import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  formatReservationCheckin,
  formatReservationCheckout,
} from "./reservationDateTime";

export type InvoiceServiceItem = {
  id: number;
  title: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type InvoiceApartmentItem = {
  title: string;
  roomsCount: number;
  guests: number;
  checkin: string;
  checkout: string;
  nights: number;
  pricePerNight: number;
  amount: number;
};

export type InvoiceTouristTaxItem = {
  guests: number;
  nights: number;
  pricePerGuestPerNight: number;
  amount: number;
};

export type InvoicePdfData = {
  email: string;
  reserveId: string;
  daysNumber: number;
  visitorsNumber: number;
  totalPrice: number;
  services: InvoiceServiceItem[];
  apartment?: InvoiceApartmentItem;
  touristTax?: InvoiceTouristTaxItem;
  paidAt?: string;
  receiptNumber?: string;
};

const formatEuro = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);

const formatDate = (date?: string) => {
  const currentDate = date ? new Date(date) : new Date();

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(currentDate);
};

export const createInvoicePdf = (data: InvoicePdfData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const hasApartment = Boolean(data.apartment);
  const hasServices = data.services.length > 0;
  const apartmentSubtotal = data.apartment?.amount ?? 0;
  const servicesSubtotal = data.services.reduce((sum, service) => sum + service.amount, 0);
  const touristTaxAmount = data.touristTax?.amount ?? 0;
  const grandTotal = data.totalPrice || apartmentSubtotal + servicesSubtotal + touristTaxAmount;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(
    hasApartment && !hasServices
      ? "Apartment reservation invoice"
      : hasApartment
        ? "Purchase invoice"
        : "Service receipt",
    20,
    24,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Date paid: ${formatDate(data.paidAt)}`, 20, 34);

  if (data.receiptNumber) {
    doc.text(`Receipt number: ${data.receiptNumber}`, 20, 40);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Au calme a la campagne", 20, 56);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("13 Rue Des Acots", 20, 63);
  doc.text("25580 Etalans", 20, 69);
  doc.text("France", 20, 75);
  doc.text("+33 6 36 65 20 35", 20, 81);

  doc.setFont("helvetica", "bold");
  doc.text("Bill to", pageWidth - 70, 56);

  doc.setFont("helvetica", "normal");
  doc.text(data.email, pageWidth - 70, 63);
  doc.text(`Reservation code: ${data.reserveId}`, pageWidth - 70, 69);
  doc.text(`Guests: ${String(data.visitorsNumber)}`, pageWidth - 70, 75);
  doc.text(`Nights: ${String(data.daysNumber)}`, pageWidth - 70, 81);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${formatEuro(grandTotal)} paid`, 20, 102);

  let tableStartY = 115;

  if (data.apartment) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Apartment", 20, tableStartY);

    autoTable(doc, {
      startY: tableStartY + 6,
      head: [["Apartment", "Rooms", "Guests", "Check-in", "Check-out", "Nights", "Price/night", "Total"]],
      body: [[
        data.apartment.title,
        String(data.apartment.roomsCount),
        String(data.apartment.guests),
        formatReservationCheckin(data.apartment.checkin) ?? formatDate(data.apartment.checkin),
        formatReservationCheckout(data.apartment.checkout) ?? formatDate(data.apartment.checkout),
        String(data.apartment.nights),
        formatEuro(data.apartment.pricePerNight),
        formatEuro(data.apartment.amount),
      ]],
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: 2.4,
      },
      headStyles: {
        fontStyle: "bold",
      },
    });

    tableStartY = ((doc as jsPDF & { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY ?? tableStartY + 28) + 14;
  }

  if (hasServices) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Services", 20, tableStartY);

    autoTable(doc, {
      startY: tableStartY + 6,
      head: [["Service", "Qty", "Unit price", "Total"]],
      body: data.services.map((service) => [
        service.title,
        String(service.quantity),
        formatEuro(service.unitPrice),
        formatEuro(service.amount),
      ]),
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fontStyle: "bold",
      },
    });
  }

  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } })
    .lastAutoTable?.finalY ?? tableStartY;

  const totalLabelX = pageWidth - 95;
  const totalValueX = pageWidth - 20;
  const totalRows = [
    hasApartment ? { label: "Apartment subtotal", value: apartmentSubtotal, bold: false } : null,
    hasServices ? { label: "Services subtotal", value: servicesSubtotal, bold: false } : null,
    data.touristTax ? {
      label: `Tourist tax (${data.touristTax.guests} x ${data.touristTax.nights} x ${formatEuro(data.touristTax.pricePerGuestPerNight)})`,
      value: touristTaxAmount,
      bold: false,
    } : null,
    { label: "Grand total", value: grandTotal, bold: true },
    { label: "Amount paid", value: grandTotal, bold: true },
  ].filter((row): row is { label: string; value: number; bold: boolean } => Boolean(row));

  totalRows.forEach((row, index) => {
    const y = finalY + 16 + index * 12;

    doc.setFont("helvetica", row.bold ? "bold" : "normal");
    doc.text(row.label, totalLabelX, y);
    doc.text(formatEuro(row.value), totalValueX, y, {
      align: "right",
    });
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Thank you for your payment.", 20, 285);

  return doc;
};
