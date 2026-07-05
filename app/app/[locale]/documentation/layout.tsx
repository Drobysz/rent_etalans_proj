import { SideMenu } from "./layout/index";
import s from "./layout/GridLayout.module.scss";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return createPageMetadata(locale, "documentation", "/documentation");
}

export default function DocsLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className={s.wrapper}>
            <SideMenu 
                className={s.aside}
            />
            <section className={s.page}>
                {children}
            </section>
        </div>
    )
}
