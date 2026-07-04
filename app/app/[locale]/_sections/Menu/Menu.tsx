"use client";

import s from "./style.module.scss";
import {
    MenuCard
} from "./_components";
import { useState } from "react";
import { useTranslations } from "next-intl";

export const Menu = ()=> {
    const [hover, setHover] = useState(false);
    const t = useTranslations("home.menu");

    const cards = [
        { img: "/main_page/reservation.jpg", href: "/housing/reservation", label: t("reservation") },
        { img: "/main_page/services.jpg", href: "/housing/services", label: t("services") },
        { img: "/main_page/docs.jpg", href: "/documentation", label: t("documentation") },
    ];

    return (
        <section className={s.container}>
            <div 
                className={s.extandable_cards}
                onMouseEnter={()=> setHover(true)}
                onMouseLeave={()=> setHover(false)}
            >
                {cards.map((c, idx)=>
                    <MenuCard
                        key={`menu-item-${idx}`}
                        href={c.href}
                        img_url={c.img}
                        label={c.label}
                        areCardsHovered={hover}
                    />
                )}
            </div>
        </section>
    )
}
