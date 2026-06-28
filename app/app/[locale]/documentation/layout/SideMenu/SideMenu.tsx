"use client";

import { cn } from "@/lib/utils";
import s from "./style.module.scss";
import { usePathname } from "next/navigation";
import { bagel } from "@/fonts/fonts";
import {
    DocCategory,
    Cursor
} from "./_components";
import { useState } from "react";
import { PathService } from "@/helpers/path";
import { useTranslations } from "next-intl";
import { CursorCoordProps } from "./types";

export const SideMenu = ({
    className
}: {
    className: string;
})=> {
    const pn = usePathname();
    const t = useTranslations("documentation.sideMenu");
    const defaultCoord = {left: 0, top: 0};
    const [cursorVertCoord, setCursorVertCoord] = useState<CursorCoordProps>(defaultCoord);
    const [cursorVertClickedCoord, setCursorVertClickedCoord] = useState<CursorCoordProps>(defaultCoord);

    const docs = [
        { href: "/documentation/privacy_policy", label: t("privacyPolicy") },
        { href: "/documentation/meals", label: t("meals") },
        { href: "/documentation/developer", label: t("developer") },
    ];
    const isHidden = pn.split('/').length < 4;

    return (
        <aside
            className={cn(
                className,
                "flex flex-col gap-2 relative"
            )}
        >
            <h2 className={cn(
                s.title,
                bagel.className
            )}>
                {t("categories")}
            </h2>
            <div className={s.list_wrap}>
                <ul className={s.list}>
                    {docs.map((p, i)=>
                        <DocCategory
                            key={`doc-${i}`}
                            href={p.href}
                            isActive={PathService.getPageActivity(pn, p.href)}
                            cursorVertClickedCoord={cursorVertClickedCoord}
                            setCursorVertCoord={setCursorVertCoord}
                            setCursorVertClickedCoord={setCursorVertClickedCoord}
                        >
                            {p.label}
                        </DocCategory>
                    )}
                    <Cursor 
                        cursorCoord={cursorVertCoord}
                        isHidden={isHidden}
                    />
                </ul>
            </div>
        </aside>
    )
}
