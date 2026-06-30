import { PathService } from "@/helpers/path";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function MealsPage ({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "documentation.meals" });
    const items = t.raw("items") as string[];
    const ps = PathService;

    return (
        <article className="p-4">
            <header className="pb-5">
                <h1 className="font-bold text-neutral-700 text-4xl">
                    {t("title")}
                </h1>
                <p className="text-neutral-500 text-sm">
                    {t("description")}
                </p>
            </header>

            <Image
                className="h-80 w-60 rounded-xl"
                width={125}
                height={250}
                src={ps.withBasePath("/breakfast.jpg")}
                alt={t("imageAlt")}
                loading="eager"
            />

            <ul className="flex flex-col gap-1 text-neutral-500 pl-1 pt-4 max-[560px]:text-sm">
                {items.map((item) => (
                    <li key={item}>
                        {item}
                    </li>
                ))}
            </ul>
        </article>
    )
}
