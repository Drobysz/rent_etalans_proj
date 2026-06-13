import type { Metadata } from "next";
import { b612_regular } from "@/fonts/fonts";
import {
  Header,
  Footer,
  MouseGuide,
  Basket,
  NotificationBar
} from "./layout/index";
import "./globals.css";
import { GlobalContextProvider } from "./context/global.context";
import s from "./layout/layout.module.scss";

export const metadata: Metadata = {
  title: "Services supplémentaires",
  description: "Services supplémentaires pour la location d'une chambre à Etalans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={b612_regular.className}>
      <body>
        <GlobalContextProvider>
          <div className={s.wrapper}>
            <Header className={s.header} />
            <main className={s.main}>
              {children}
            </main>
            <Footer className={s.footer} />
            <MouseGuide />
            <Basket />
            <NotificationBar />
          </div>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
