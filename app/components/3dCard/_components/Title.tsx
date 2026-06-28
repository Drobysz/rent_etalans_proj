"use client";

import { cn } from "@/lib/utils";
import s from "./../style.module.scss";
import { b612_bold } from "@/fonts/fonts";
import { 
  CardItem as Card3dItem,
  DefaultItem
} from "@/components/ui/3d-card";
import { ReactNode } from "react";

export const Title = ({
    isChosen, is3dCard, children
}: {
    
    isChosen: boolean;
    is3dCard: boolean;
    children: ReactNode;
})=> {
    const Item = is3dCard ? Card3dItem : DefaultItem;

    return (
        <Item
          translateZ="50"
          className={cn(
            s.title,
            b612_bold.className,
            isChosen 
              ? "text-amber-600" 
              : "text-neutral-600"
          )}
        >
          {children}
        </Item>
    )
}