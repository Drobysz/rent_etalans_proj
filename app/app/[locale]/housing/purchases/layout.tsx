import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return createPageMetadata(locale, "purchases", "/housing/purchases", {
    noIndex: true,
  });
}

export default function PurchasesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
