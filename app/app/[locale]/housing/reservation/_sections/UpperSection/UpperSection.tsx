"use client";

import { ImageSwitcher } from "@/components/ImageSwitcher/ImageSwitcher";
import apartmentImages from "./apartment_images"
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { bagel } from "@/fonts/fonts";
import { Header } from "./Header/Header";
import { useWindowWidth } from "@/hooks";

export const UpperSection = ()=> {
    const isDesktop = useWindowWidth(860) as boolean;

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
                        Housing
                    </h2>

                    <p className={s.desc}>
                        A room in a house, with a bathroom and living room available for use, in a private home. Privacy guaranteed!
                    </p>
                </div>

                <div className={s.paragraph}>
                    <h2 className={cn(
                        s.paragraph_title,
                        bagel.className
                    )}>
                        Other notes
                    </h2>

                    <p className={s.desc}>
                        An additional room with a double bed and breakfast (5 euros) is available upon request.
                    </p>
                </div>
            </div>
        </section>
    )
}