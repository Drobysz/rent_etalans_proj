"use client";

import s from "./style.module.scss";
import { PathService } from "@/helpers/path";
import Image from "next/image";
import { useWindowWidth } from "@/hooks";
import { Note } from "./Note/Note";
import { useTranslations } from "next-intl";
import { SplitText } from "@/components/animations/Texts/SplitText/SplitText";
import { ViewReveal } from "@/components/animations/ViewReveal/ViewReveal";

export const Renting = ()=> {
    const isDesktop = useWindowWidth(770) as boolean;
    const t = useTranslations("home.renting");

    return (
        <section className={s.container}>
            <div className={s.inner_content}>
                <header className={s.header}>
                    <SplitText
                        className={s.title}
                        tag="h2"
                    >
                        {t("title")}
                    </SplitText>
                    {isDesktop && <Note />}
                </header>
                <ViewReveal
                    animationType="disclosure"
                    className="w-full"
                >
                    <Image
                        src={PathService.withBasePath("/house/salon.jpg")}
                        className={s.salon_cover}
                        width={400}
                        height={250}
                        alt={t("imageAlt")}
                    />
                </ViewReveal>
                {!isDesktop && <Note />}
            </div>
        </section>
    )
}
