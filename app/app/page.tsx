import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_URL, SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        DEFAULT_SITE_URL
    ),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: "Room rental, apartment reservations and additional services in Etalans, Bourgogne-Franche-Comte, France.",
    keywords: [
        "Etalans",
        "Doubs",
        "Bourgogne-Franche-Comte",
        "apartment rental",
        "room rental",
        "holiday rental",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: SITE_NAME,
        description: "Room rental, apartment reservations and additional services in Etalans, Bourgogne-Franche-Comte, France.",
        url: "/",
        siteName: SITE_NAME,
        type: "website",
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 2560,
                height: 1440,
                alt: SITE_NAME,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: "Room rental, apartment reservations and additional services in Etalans, Bourgogne-Franche-Comte, France.",
        images: [DEFAULT_OG_IMAGE],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

export default function RootPage() {
    redirect({ href: "/", locale: routing.defaultLocale });
}
