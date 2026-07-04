"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import s from "./style.module.scss";
import { MoveRight } from "lucide-react";
import { MenuCardProps } from "./MenuCards.props";
import { PathService } from "@/helpers/path";
import { useWindowWidth } from "@/hooks";

export const MenuCard = ({
    className,
    img_url,
    href,
    label,
    areCardsHovered
}: MenuCardProps)=> {
    const [hover, setHover] = useState(false);
    const isDesktop = useWindowWidth(560) as boolean;
    const isLabelVisible = !isDesktop || !areCardsHovered || hover;

    return (
        <article 
            onMouseEnter={()=> setHover(true)}
            onMouseLeave={()=> setHover(false)}
            className={cn(
                className,
                s.card,
                hover && s.card_active
            )}
        >
            <Link
                href={href}
                className="w-full h-full rounded-xl overflow-hidden"
            >
                <div
                    className={s.article}
                    style={{
                        backgroundImage: PathService.withBasePath(`url('${img_url}')`),
                    }}
                />
            </Link>
            <h2 
                className={cn(
                    "flex gap-1.5 items-center pl-2",
                    !isLabelVisible && "opacity-0"
                )}
            >
                {label}
                <MoveRight 
                    className={cn(
                        s.arrow,
                        hover || !isDesktop 
                            ? "opacity-100" : "opacity-0"
                    )}
                />
            </h2>            
        </article>
    )
}