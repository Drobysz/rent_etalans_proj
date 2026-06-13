"use client";

import { NotificationStatus } from "@/app/context/global.interface"
import { ReactNode, useState } from "react"
import s from "./style.module.scss";
import cn from "classnames";
import {
    Ban,
    X,
    BookAlert,
    Check
} from "lucide-react";

export const NotificationPopUp = ({
    children,
    status
}: {
    children: ReactNode,
    status: NotificationStatus
})=> {
    const [visible, setVisible] = useState(true);
    const icons = {
        "error": Ban,
        "alert": BookAlert,
        "success": Check,
        "none": null
    };
    const Icon = icons[status];

    return (
        <div
            className={cn(
                visible ? "flex" : "hidden",
                s.notif_popup, {
                    ["bg-red-200 border-red-700 text-red-500"]: status == "error",
                    ["bg-orange-100 border-amber-400 text-amber-400"]: status == "alert",
                    ["bg-green-200 border-green-700 text-green-500"]: status == "success",
                }
            )}
        >
            {Icon !== null && 
                <Icon 
                    width={15}
                    height={15}
                />
            }
            {children}
            <div
                className={s.cross}
                onClick={()=> setVisible(p=>!p)}
            >
                <X />
            </div>
        </div>
    )
}