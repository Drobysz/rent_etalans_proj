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
import { SplitText } from "@/components/animations/Texts/SplitText/SplitText";
import { motion } from "framer-motion";

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
                <motion.div
                    viewport={{
                        once: true,
                    }}
                    initial={{
                        clipPath: "inset(48% 48% 48% 48% round 24px)",
                    }}
                    whileInView={{
                        clipPath: "inset(0% 0% 0% 0% round 24px)",
                    }}
                    transition={{
                        duration: 1.3,
                        ease: [0.33, 1, 0.68, 1]
                    }}
                >
                    <Image
                        className={s.yard_image}
                        src={PathService.withBasePath("/house/front_yard.png")}
                        width={1000}
                        height={300}
                        alt={t("imageAlt")}
                    />
                </motion.div>
                <div className="flex flex-col gap-4">
                    <SplitText 
                        className={cn(
                            s.title,
                            bagel.className
                        )}
                        tag="h3"
                        hidden={!isMobile}
                    >
                        {t("title")}
                    </SplitText>
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
