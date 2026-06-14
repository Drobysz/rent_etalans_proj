import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type InvoiceServiceItem = {
  id: number;
  title: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type InvoicePdfData = {
  email: string;
  reserveId: string;
  daysNumber: number;
  visitorsNumber: number;
  totalPrice: number;
  services: InvoiceServiceItem[];
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

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Receipt", 20, 24);

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
  doc.text(`Reservation: ${data.reserveId}`, pageWidth - 70, 69);
  doc.text(`Visitors: ${String(data.visitorsNumber)}`, pageWidth - 70, 75);
  doc.text(`Days: ${String(data.daysNumber)}`, pageWidth - 70, 81);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${formatEuro(data.totalPrice)} paid`, 20, 102);

  autoTable(doc, {
    startY: 115,
    head: [["Description", "Qty", "Unit price", "Amount"]],
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

  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } })
    .lastAutoTable?.finalY ?? 130;

  const totalLabelX = pageWidth - 95;
  const totalValueX = pageWidth - 20;
  const totalRows = [
    { label: "Subtotal", value: data.totalPrice, bold: false },
    { label: "Total", value: data.totalPrice, bold: true },
    { label: "Amount paid", value: data.totalPrice, bold: true },
  ];

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
