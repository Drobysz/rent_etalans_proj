"use client";

import { 
  CardItem as Card3dItem,
  DefaultItem
} from "@/components/ui/3d-card";
import s from "./../style.module.scss";
import { MouseEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const Desc = ({
    is3dCard,
    desc
}: {
    is3dCard: boolean;
    desc: string;
})=> {
    const t = useTranslations("services");
    const [descConceal, setDescConceal] = useState(true);

    const Item = is3dCard ? Card3dItem : DefaultItem;

    const isLong = desc.length > 60;
    const descShort = desc.slice(0, 59) + "...";

    const handleReadBtnClick = (e: MouseEvent<HTMLButtonElement>)=> {
      e.stopPropagation();
      setDescConceal(p => !p);
    };

    return (
        <Item
          as="p"
          translateZ="60"
          className={s.desc}
        >
          {isLong &&
            <>
              {descConceal ? descShort : desc}
                <button 
                  className={cn(
                    s.read_btn,
                    descConceal 
                      ? "hover:border-amber-600/50 hover:bg-amber-400/10" 
                      : "hover:border-red-600/50 hover:bg-red-400/10"
                  )}
                  onClick={handleReadBtnClick}
                >
                  <span className={cn(
                    "z-20",
                    descConceal ? "text-yellow-600" : "text-red-700"
                  )}>
                    {descConceal ? t("readMore") : t("readLess")}
                  </span>
                  <div />
                </button>
            </>
          }
          {!isLong && desc}
        </Item>
    )
}