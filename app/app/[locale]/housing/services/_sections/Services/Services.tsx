import { inter_extrabold } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { Cards } from "./_components";
import s from "./style.module.scss";
import { useTranslations } from "next-intl";
import { SplitText } from "@/components/animations/Texts/SplitText/SplitText";

export const Services = ()=> {
    const t = useTranslations("home");

    return (
        <section className={s.section}>
            <div className="flex justify-center">
                <SplitText 
                    className={cn(
                        s.title,
                        inter_extrabold.className
                    )}
                    tag="h2"
                >
                    {t("servicesTitle")}
                </SplitText>
            </div>
            <Cards />
        </section>
    )
}
