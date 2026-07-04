"use client";

import { PathService } from "@/helpers/path"
import Image from "next/image"
import s from "./style.module.scss";
import { ScrollParagraph } from "@/components/animations/ScrollParagraph/ScrollParagraph";
import { useRef } from "react";
import { useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { bagel } from "@/fonts/fonts";
import { useWindowWidth } from "@/hooks";
import { useTranslations } from "next-intl";

export const ScrollableText = ()=> {
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useWindowWidth(960) as boolean;
    const t = useTranslations("home.scrollableText");
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 20%", "end 90%"],
    });

    return (
        <section 
            className="flex justify-center h-[800vh]"
            ref={ref}
        >
            <div className={s.inner_content}>
                <h3 
                    className={cn(
                        s.title,
                        bagel.className
                    )}
                    hidden={isMobile}
                >
                    {t("title")}
                </h3>
                <Image
                    className={s.yard_image}
                    src={PathService.withBasePath("/house/front_yard.png")}
                    width={1000}
                    height={300}
                    alt={t("imageAlt")}
                />
                <div className="flex flex-col gap-4">
                    <h3 
                        className={cn(
                            s.title,
                            bagel.className
                        )}
                        hidden={!isMobile}
                    >
                        {t("title")}
                    </h3>
                    <ScrollParagraph
                        className={s.paragraph}
                        scrollYProgress={scrollYProgress}
                    >
                        {t("body")}
                    </ScrollParagraph>
                </div>
            </div>
        </section>
    )
}
