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

const SITE_NAME = "Au calme de la campagne";

const OPEN_GRAPH_LOCALES: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
};

const getLocalizedPath = (locale: string, path: string) => {
  const normalizedPath = path === "/" ? "" : path;

  return `/${locale}${normalizedPath}`;
};

type PageMetadataOptions = {
  noIndex?: boolean;
};

export async function createPageMetadata(
  locale: string,
  page: PageMetadataKey,
  path: string,
  options: PageMetadataOptions = {},
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `metadata.${page}` });
  const title = t("title");
  const description = t("description");
  const canonical = getLocalizedPath(locale, path);
  const languages = Object.fromEntries(
    routing.locales.map((availableLocale) => [
      availableLocale,
      getLocalizedPath(availableLocale, path),
    ]),
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "website",
      locale: OPEN_GRAPH_LOCALES[locale] ?? locale,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: !options.noIndex,
      follow: !options.noIndex,
    },
  };
}
