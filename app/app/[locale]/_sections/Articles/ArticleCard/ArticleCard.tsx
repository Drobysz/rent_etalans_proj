"use client";

import { useState } from "react";
import s from "./style.module.scss";
import { PathService } from "@/helpers/path";
import { ArticleCardProps } from "./ArticleCard.props";
import { cn } from "@/lib/utils";
import { bagel } from "@/fonts/fonts";
import { useWindowWidth } from "@/hooks";

export const ArticleCard = ({
    label, href, img_url,
    note, isSectionHovered, className
}: ArticleCardProps)=> {
    const [hover, setHover] = useState(false);
    const isDesktop = useWindowWidth(930) as boolean;
    const isConcealed = isSectionHovered && !hover && isDesktop;

    return (
        <article 
            className={cn(
                s.article,
                isConcealed && "blur-xs",
                className
            )}
            onMouseEnter={()=> setHover(true)}
            onMouseLeave={()=> setHover(false)}
        >
            <div
                className={cn(
                    s.bg_img,
                    hover && s.bg_img_hover
                )}
                style={{
                    backgroundImage: `url(${(PathService.withBasePath(img_url))})`
                }}
            />
            <div className={cn(
                s.note_bar,
                hover || !isDesktop ? s.note_bar_hover : s.note_bar_default
            )}>
                <div className="flex flex-col gap-1">
                    <h2 className={cn(
                        s.note_bar_title,
                        bagel.className
                    )}>
                        {label}
                    </h2>
                    <p className={s.note_bar_note}>
                        {note}
                    </p>
                </div>
                <a
                    href={href}
                    target="_blank"
                    className={s.view_link}
                >
                    View
                </a>
            </div>
        </article>
    )
}