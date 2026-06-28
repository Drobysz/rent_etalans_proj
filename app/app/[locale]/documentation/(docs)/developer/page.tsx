import { UnderlinedInnerLink } from "@/components/animations/UnderlinedLink/UnderlinedInnerLink";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function DeveloperPage ({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "documentation.developer" });

    return (
        <article className="p-10 max-[560px]:p-3">
            <header className="pb-5">
                <h1 className="text-4xl text-neutral-700 font-bold max-[560px]:text-2xl">
                    {t("title")}
                </h1>
                <p className="text-neutral-500 max-[560px]:text-xs">
                    {t("description")}
                    <span className="w-fit h-fit pl-1 relative">
                        <UnderlinedInnerLink
                            className="text-blue-600"
                            colorLine="primary"
                            href={t("linkUrl")}
                        >
                            {t("linkText")}
                        </UnderlinedInnerLink>
                    </span>
                </p>
            </header>
            <Image
                className="w-full h-[60%] rounded-xl "
                src="/developer.png"
                width={2648}
                height={1334}
                alt={t("imageAlt")}
                loading="eager"
            />
        </article>
    )
}
