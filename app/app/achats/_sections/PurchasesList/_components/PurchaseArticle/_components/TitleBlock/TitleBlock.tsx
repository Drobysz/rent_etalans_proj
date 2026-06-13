"use client"

import { Dispatch, SetStateAction } from "react";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

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
    return (
        <div className={s.body}>
            <div className="flex gap-1">
                <span className={s.reserve_code_title}>
                    Reservation code:
                </span>
                <span className={s.reserve_code}>
                    {reserve_id}
                </span>
            </div>

            <div className={s.total}>
                <span>
                    Total:
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