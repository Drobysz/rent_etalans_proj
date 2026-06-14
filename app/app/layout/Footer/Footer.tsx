"use client";

import s from "./style.module.scss";
import {
    DevTitle
} from "./_components";
import { bilbo_swash_caps } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import smLinks from "./link";
import { SMbar } from "@/components/animations/SMbar/SMbar";

export const Footer = ({
    className
}: {
    className: string
}) => {
    return (
        <footer className={cn(
            className,
            s.footer
        )}>
            <DevTitle 
                className={s.dev_title}
            />
            <p className={cn(
                bilbo_swash_caps.className,
                "text-3xl text-gray-500",
                s.hand_writing_title
            )}>
                Vos vacances à Etalans
            </p>
            <div className={s.sm_bar_space}>
                <SMbar
                    className={s.sm_list}
                    SMList={smLinks}
                />
            </div>
        </footer>
    )
}
