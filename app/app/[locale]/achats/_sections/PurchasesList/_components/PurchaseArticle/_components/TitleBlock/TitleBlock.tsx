"use client"

import { Dispatch, SetStateAction } from "react";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export const TitleBlock = ({
    reserve_id,
    total_price,
    isOpened,
    setIsOpened
}: {
    reserve_id?: string;
    total_price?: number | string;
    isOpened: boolean;
    setIsOpened: Dispatch<SetStateAction<boolean>>
})=> {
    const t = useTranslations("achats");

    return (
        <div className={s.body}>
            <div className="flex gap-1">
                <span className={s.reserve_code_title}>
                    {t("reservationCode")}
                </span>
                <span className={s.reserve_code}>
                    {reserve_id}
                </span>
            </div>

            <div className={s.total}>
                <span>
                    {t("total")}
                </span>
                <span>
                    {`${total_price}€`}
                </span>
            </div>

            <div
                onClick={()=> setIsOpened(p=> !p)}
                className={cn(
                    s.cross,
                    !isOpened && "rotate-45"
                )}
            >
                <X />
            </div>
        </div>
    )
}
