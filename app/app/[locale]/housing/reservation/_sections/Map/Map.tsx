import { useTranslations } from "next-intl";
import s from "./style.module.scss";
import { ViewReveal } from "@/components/animations/ViewReveal/ViewReveal";
import { SplitByRowsText } from "@/components/animations/Texts/SplitByRowsText/SplitByRowsText";
import { SplitText } from "@/components/animations/Texts/SplitText/SplitText";

export const Map = ()=> {
    const t = useTranslations("reservation.map");

    return (
        <section className="flex flex-col gap-4 self-stretch max-[590px]:gap-2">
            <header className={s.header}>
                <SplitByRowsText 
                    className={s.title}
                    tag="h2"
                >
                    {t("title")}
                </SplitByRowsText>
                <SplitText 
                    className={s.subtitle}
                    tag="p"
                >
                    {t("subtitle")}
                </SplitText>
            </header>
            <ViewReveal 
                className={s.map}
                animationType="disclosure"
            >
                <iframe 
                    src="https://shorturl.at/f6LFu" 
                    width="100%" 
                    height="400" 
                    style={{
                        border: 0
                    }}
                    allowFullScreen
                    loading="lazy" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                />
            </ViewReveal>
        </section>
    )
}
