import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return createPageMetadata(locale, "cancel", "/cancel", { noIndex: true });
}

export default function CancelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
