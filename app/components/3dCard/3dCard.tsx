"use client";

import Image from "next/image";
import { 
  CardBody as Card3dBody, 
  CardContainer as Card3dContainer, 
  CardItem as Card3dItem,
  DefaultItem
} from "@/components/ui/3d-card";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { MouseEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useWindowWidth } from "@/hooks";
import { b612_bold } from "@/fonts/fonts";

export default function ThreeDCard({
  title, desc, btnStyle,
  btnSign, price, img_url,
  className, isChosen, IsFixedPrice,
  btnAction
}: {
  title: string;
  desc: string;
  btnStyle?: string;
  btnSign?: string;
  price?: number;
  img_url: string;
  isChosen: boolean;
  IsFixedPrice: boolean;
  className?: string;
  btnAction?: () => void;
}) {
  const t = useTranslations("services");
  const [descConceal, setDescConceal] = useState(true);

  const isLong = desc.length > 60;
  const descShort = desc.slice(0, 59) + "...";

  const is3dCard = useWindowWidth(768) as boolean;
  const Container = is3dCard ? Card3dContainer : "article";
  const Body = is3dCard ? Card3dBody : DefaultItem;
  const Item = is3dCard ? Card3dItem : DefaultItem;

  const handleReadBtnClick = (e: MouseEvent<HTMLButtonElement>)=> {
    e.stopPropagation();
    setDescConceal(p => !p);
  };

  return (
    <Container>
      <Body 
        className={cn(
          s.body,
          className,
          "group/card", {
            [s.body_chosen]: isChosen,
            ["active:scale-97"]: is3dCard
          }
        )}
        onClick={is3dCard ? btnAction : ()=> {}}
      >
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
          {title}
        </Item>
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
        <Item 
          translateZ="100" 
          className="w-full pt-4"
        >
          <Image
            src={img_url}
            height={400}
            width={400}
            className={cn(s.img, "group-hover/card:shadow-xl")}
            alt="thumbnail"
          />
        </Item>
        {btnSign &&
          <div className={s.bottom}>
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
              {btnSign}
            </Item>
            <Item
              translateZ={20}
              as="button"
              className={cn(s.price, "text-gold")}
              onClick={!is3dCard ? btnAction : ()=> {}}
            >
              <div className="flex items-start">
                {`${price}`}
                <span className={s.currency}>
                  €
                  {!IsFixedPrice &&
                    <span className="text-xs">
                      {t("perDay")}
                    </span>
                  }
                </span>
              </div>
            </Item>
            
          </div>
        }
      </Body>
    </Container>
  );
}
