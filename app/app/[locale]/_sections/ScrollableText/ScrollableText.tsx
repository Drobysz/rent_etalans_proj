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

export const ScrollableText = ()=> {
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useWindowWidth(960) as boolean;
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
                    Au la calme de la campagne
                </h3>
                <Image
                    className={s.yard_image}
                    src={PathService.withBasePath("/house/front_yard.png")}
                    width={1000}
                    height={300}
                    alt="rent house"
                />
                <div className="flex flex-col gap-4">
                    <h3 
                        className={cn(
                            s.title,
                            bagel.className
                        )}
                        hidden={!isMobile}
                    >
                        Au la calme de la campagne
                    </h3>
                    <ScrollParagraph
                        className={s.paragraph}
                        scrollYProgress={scrollYProgress}
                    >
                        We look forward to welcoming you to “Au calme de la campagne,” 
                        located in the Doubs department, known for its blend of historical 
                        heritage and natural beauty. The area is home to Besançon and its 
                        UNESCO-listed citadel, the picturesque towns of Ornans and Pontarlier, 
                        Lake Saint-Poin, the Saut du Doubs waterfall, and the Château de Joux fortress.
                    </ScrollParagraph>
                </div>
            </div>
        </section>
    )
}
