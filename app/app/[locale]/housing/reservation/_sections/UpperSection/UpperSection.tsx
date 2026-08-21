"use client";

import { ImageSwitcher } from "@/components/ImageSwitcher/ImageSwitcher";
import apartmentImages from "./apartment_images"
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { bagel } from "@/fonts/fonts";
import { Header } from "./Header/Header";
import { useWindowWidth } from "@/hooks";
import { useTranslations } from "next-intl";
import { SplitByRowsText } from "@/components/animations/Texts/SplitByRowsText/SplitByRowsText";
import { SplitText } from "@/components/animations/Texts/SplitText/SplitText";
import { ViewReveal } from "@/components/animations/ViewReveal/ViewReveal";

export const UpperSection = ()=> {
    const isDesktop = useWindowWidth(860) as boolean;
    const t = useTranslations("reservation.upperSection");

    return (
        <section className={s.upper_section}>
            {!isDesktop && <Header />}
            <ViewReveal>
                <ImageSwitcher 
                    images={apartmentImages}
                    nb_lits={2}
                    format3d={false}
                    isImageLocal
                    imageCoverClassName={s.image_cover}
                />
            </ViewReveal>
            <div className="flex flex-col gap-8">
                {isDesktop && <Header />}
                <div className={s.paragraph}>
                    <SplitByRowsText 
                        className={cn(
                            s.paragraph_title,
                            bagel.className
                        )}
                        tag="h2"
                    >
                        {t("housingTitle")}
                    </SplitByRowsText>

                    <SplitText 
                        className={s.desc}
                        tag="p"
                    >
                        {t("housingDescription")}
                    </SplitText>
                </div>

                <div className={s.paragraph}>
                    <SplitByRowsText 
                        className={cn(
                            s.paragraph_title,
                            bagel.className
                        )}
                        tag="h2"
                    >
                        {t("notesTitle")}
                    </SplitByRowsText>

                    <SplitText 
                        className={s.desc}
                        tag="p"
                    >
                        {t("notesDescription")}
                    </SplitText>
                </div>
            </div>
        </section>
    )
}
