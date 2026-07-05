import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Au calme de la campagne",
    description: "Room rental, apartment reservations and additional services in Etalans, Bourgogne-Franche-Comte, France.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootPage() {
    redirect({ href: "/", locale: routing.defaultLocale });
}
