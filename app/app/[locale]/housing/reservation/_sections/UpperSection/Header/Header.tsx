import { cn } from "@/lib/utils";
import s from "../style.module.scss";
import { bilbo_swash_caps } from "@/fonts/fonts";
import { useTranslations } from "next-intl";

export const Header = ()=> {
    const t = useTranslations("reservation.header");

    return (
        <header className={s.header}>
            <h1 className={cn(
                bilbo_swash_caps.className,
                s.title
            )}>
                {t("title")}
            </h1>
            <p className={s.subtitle}>
                {t("subtitle")}
            </p>
        </header>
    )
}
