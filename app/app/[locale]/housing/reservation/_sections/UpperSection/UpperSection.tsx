"use client";

import { ImageSwitcher } from "@/components/ImageSwitcher/ImageSwitcher";
import apartmentImages from "./apartment_images"
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { bagel } from "@/fonts/fonts";
import { Header } from "./Header/Header";
import { useWindowWidth } from "@/hooks";
import { useTranslations } from "next-intl";

export const UpperSection = ()=> {
    const isDesktop = useWindowWidth(860) as boolean;
    const t = useTranslations("reservation.upperSection");

    return (
        <section className={s.upper_section}>
            {!isDesktop && <Header />}
            <ImageSwitcher 
                images={apartmentImages}
                nb_lits={2}
                format3d={false}
                imageCoverClassName={s.image_cover}
            />
            <div className="flex flex-col gap-8">
                {isDesktop && <Header />}
                <div className={s.paragraph}>
                    <h2 className={cn(
                        s.paragraph_title,
                        bagel.className
                    )}>
                        {t("housingTitle")}
                    </h2>

                    <p className={s.desc}>
                        {t("housingDescription")}
                    </p>
                </div>

                <div className={s.paragraph}>
                    <h2 className={cn(
                        s.paragraph_title,
                        bagel.className
                    )}>
                        {t("notesTitle")}
                    </h2>

                    <p className={s.desc}>
                        {t("notesDescription")}
                    </p>
                </div>
            </div>
        </section>
    )
}
