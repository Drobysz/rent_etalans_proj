import { b612_regular } from "@/fonts/fonts";
import {
  Header,
  Footer,
  MouseGuide,
  NotificationBar,
  LangBar,
  SmoothScroll
} from "./layout/index";
import "./globals.css";
import { GlobalContextProvider } from "./context/global.context";
import s from "./layout/layout.module.scss";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={b612_regular.className}>
      <body>
        <NextIntlClientProvider>
          <GlobalContextProvider>
            <SmoothScroll>
              <div className={s.wrapper}>
                  <Header className={s.header} />
                  <main className={s.main}>
                    {children}
                  </main>
                  <Footer className={s.footer} />
                  <MouseGuide />
                  <NotificationBar />
                  <LangBar />
              </div>
            </SmoothScroll>
          </GlobalContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
