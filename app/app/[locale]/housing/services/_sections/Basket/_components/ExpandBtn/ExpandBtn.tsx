"use client";

import { cn } from "@/lib/utils";
import s from "./style.module.scss";
import { 
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export const ExpandBtn = ({
    isOpened,
    setIsOpened
}: {
    isOpened: boolean;
    setIsOpened: Dispatch<SetStateAction<boolean>>;
})=> {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button 
            className={cn(
                s.btn_expand,
                isOpened 
                    ? s.btn_expand_opened 
                    : s.btn_expand_conealed,
            )}
            onMouseEnter={()=> setIsHovered(true)}
            onMouseLeave={()=> setIsHovered(false)}
            onClick={()=> setIsOpened(p => !p)}
        >
            <div className="pr-2.5">
                <ChevronUp
                    width={16}
                    height={16}
                    className={cn(
                        s.arrow, {
                            ["-rotate-35 translate-[0.15rem]"]: !isOpened,
                            ["rotate-145 translate-[0.17rem]"]: isOpened,
                            ["translate-[0.1rem]"]: isHovered && !isOpened,
                            ["translate-[0.2rem]"]: isHovered && isOpened
                        }
                    )}
                />
            </div>
            <div className="pl-2.5">
                <ChevronDown 
                    width={16}
                    height={16}
                    className={cn(
                        s.arrow, {
                            ["-rotate-35 -translate-[0.15rem]"]: !isOpened,
                            ["rotate-145 -translate-[0.17rem]"]: isOpened,
                            ["-translate-[0.1rem]"]: isHovered && !isOpened,
                            ["-translate-[0.2rem]"]: isHovered && isOpened
                        }
                    )}
                />
            </div>
        </button>
    )
}