import type { Service, ServiceDescriptionLocale } from "@/types";

const fallbackLocales: ServiceDescriptionLocale[] = ["fr", "en", "de"];

export const getLocalizedServiceDescription = (
    service: Pick<Service, "description" | "descriptions">,
    locale: string,
) => {
    const normalizedLocale = locale.split("-")[0] as ServiceDescriptionLocale;
    const descriptions = service.descriptions ?? [];

    return (
        descriptions.find((item) => item.locale === normalizedLocale)?.description
        ?? fallbackLocales
            .map((fallbackLocale) =>
                descriptions.find((item) => item.locale === fallbackLocale)?.description
            )
            .find(Boolean)
        ?? service.description
    );
};
