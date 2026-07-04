import { inter_extrabold } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { Cards } from "./_components";
import s from "./style.module.scss";
import { useTranslations } from "next-intl";

export const Services = ()=> {
    const t = useTranslations("home");

    return (
        <section className={s.section}>
            <h2 className={cn(
                s.title,
                inter_extrabold.className
            )}>
                {t("servicesTitle")}
            </h2>
            <Cards />
        </section>
    )
}
