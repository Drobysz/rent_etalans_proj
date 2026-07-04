"use client";

import s from "./style.module.scss";
import {
    MenuCard
} from "./_components";
import { useState } from "react";

export const Menu = ()=> {
     const [hover, setHover] = useState(false);

    const cards = [
        { img: "/main_page/reservation.jpg", href: "/housing/reservation", label: "Reservation" },
        { img: "/main_page/services.jpg", href: "/housing/services", label: "Services" },
        { img: "/main_page/docs.jpg", href: "/documentation", label: "Documentation" },
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