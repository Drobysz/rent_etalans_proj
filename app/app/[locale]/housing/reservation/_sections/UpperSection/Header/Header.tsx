import { cn } from "@/lib/utils";
import s from "../style.module.scss";
import { bagel } from "@/fonts/fonts";
import { useTranslations } from "next-intl";
import { SplitText } from "@/components/animations/Texts/SplitText/SplitText";
import { SplitByRowsText } from "@/components/animations/Texts/SplitByRowsText/SplitByRowsText";

export const Header = ()=> {
    const t = useTranslations("reservation.header");

    return (
        <header className={s.header}>
            <SplitByRowsText 
                className={cn(
                    bagel.className,
                    s.title
                )}
                tag="h1"
            >
                {t("title")}
            </SplitByRowsText>
            <SplitText 
                className={s.subtitle}
                tag="p"
                animationType="blurred"
            >
                {t("subtitle")}
            </SplitText>
        </header>
    )
}
