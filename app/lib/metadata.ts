import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

type PageMetadataKey =
  | "site"
  | "home"
  | "reservation"
  | "services"
  | "purchases"
  | "success"
  | "cancel"
  | "documentation"
  | "privacyPolicy"
  | "meals"
  | "developer";

export const SITE_NAME = "Au calme de la campagne";
export const DEFAULT_SITE_URL = "https://digital-harbor.shop/";
export const DEFAULT_OG_IMAGE = "/house/front_yard.png";

const OPEN_GRAPH_LOCALES: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
};

const getMetadataBase = () => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    DEFAULT_SITE_URL;

  return new URL(siteUrl);
};

const getBasePath = () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

  if (!basePath || basePath === "/") {
    return "";
  }

  return basePath.replace(/\/$/, "");
};

const getLocalizedPath = (locale: string, path: string) => {
  const normalizedPath = path === "/" ? "" : path;

  return `${getBasePath()}/${locale}${normalizedPath}`;
};

const getImagePath = (image = DEFAULT_OG_IMAGE) => `${getBasePath()}${image}`;

const getLocalizedPaths = (path: string) => Object.fromEntries(
  routing.locales.map((availableLocale) => [
    availableLocale,
    getLocalizedPath(availableLocale, path),
  ]),
);

const getPublicRobots = (): Metadata["robots"] => ({
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
});

const getPrivateRobots = (): Metadata["robots"] => ({
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
});

const withSiteName = (title: string) => {
  if (title.includes(SITE_NAME)) {
    return title;
  }

  return `${title} | ${SITE_NAME}`;
};

type PageMetadataOptions = {
  noIndex?: boolean;
  image?: string;
};

export async function createSiteMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.site" });
  const title = t("title");
  const description = t("description");
  const keywords = t.raw("keywords") as string[];
  const canonical = getLocalizedPath(locale, "/");
  const image = getImagePath();

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical,
      languages: getLocalizedPaths("/"),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: OPEN_GRAPH_LOCALES[locale] ?? locale,
      alternateLocale: routing.locales
        .filter((availableLocale) => availableLocale !== locale)
        .map((availableLocale) => OPEN_GRAPH_LOCALES[availableLocale] ?? availableLocale),
      images: [
        {
          url: image,
          width: 2560,
          height: 1440,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: getPublicRobots(),
  };
}

export async function createPageMetadata(
  locale: string,
  page: PageMetadataKey,
  path: string,
  options: PageMetadataOptions = {},
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `metadata.${page}` });
  const title = t("title");
  const description = t("description");
  const keywords = t.raw("keywords") as string[];
  const canonical = getLocalizedPath(locale, path);
  const image = getImagePath(options.image);
  const brandedTitle = withSiteName(title);

  return {
    metadataBase: getMetadataBase(),
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: getLocalizedPaths(path),
    },
    openGraph: {
      title: brandedTitle,
      description,
      siteName: SITE_NAME,
      type: "website",
      locale: OPEN_GRAPH_LOCALES[locale] ?? locale,
      alternateLocale: routing.locales
        .filter((availableLocale) => availableLocale !== locale)
        .map((availableLocale) => OPEN_GRAPH_LOCALES[availableLocale] ?? availableLocale),
      url: canonical,
      images: [
        {
          url: image,
          width: 2560,
          height: 1440,
          alt: brandedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: [image],
    },
    robots: options.noIndex ? getPrivateRobots() : getPublicRobots(),
  };
}
