"use client";

import { 
  CardItem as Card3dItem,
  DefaultItem
} from "@/components/ui/3d-card";
import { cn } from "@/lib/utils"
import s from "./../../style.module.scss";
import { BuyBtnProps } from "./BuyBtn.props";

export const BuyBtn = ({
    is3dCard,
    btnStyle,
    children,
    btnAction
}: BuyBtnProps)=> {
    const Item = is3dCard ? Card3dItem : DefaultItem;

    return (
        <Item
            translateZ={20}
            as="button"
            onClick={btnAction}
            className={cn(
                s.btn,
                btnStyle,
                !btnStyle && "bg-black text-white"
            )}
        >
            {children}
        </Item>
    )
}