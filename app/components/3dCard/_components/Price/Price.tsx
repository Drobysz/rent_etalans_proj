"use client";

import { 
  CardItem as Card3dItem,
  DefaultItem
} from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import s from "./../../style.module.scss";
import { PriceProps } from "./Price.props";

export const Price = ({
    is3dCard,
    isFixedPrice,
    children,
    btnAction
}: PriceProps)=> {
    const t = useTranslations("services");

    const Item = is3dCard ? Card3dItem : DefaultItem;

    return (
        <Item
            translateZ={20}
            as="button"
            className={cn(s.price, "text-gold")}
            onClick={!is3dCard ? btnAction : ()=> {}}
        >
            <div className="flex items-start">
            {children}
            <span className={s.currency}>
                €
                {!isFixedPrice &&
                <span className="text-xs">
                    {t("perDay")}
                </span>
                }
            </span>
            </div>
        </Item>
    )
}