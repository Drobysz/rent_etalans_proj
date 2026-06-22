import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import cn from "classnames";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Panneau d'administration",
  description: "Administration des services de location",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(geistSans.variable, geistMono.variable, "h-full antialiased")}
    >
      <body className={cn("min-h-full", "flex", "flex-col")}>{children}</body>
    </html>
  );
}
