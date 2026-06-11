"use client";

import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { MouseEvent, useState } from "react";

export default function ThreeDCard({
  title, desc, btnStyle,
  btnSign, price, img_url,
  className, isChosen,
  btnAction
}: {
  title: string;
  desc: string;
  btnStyle?: string;
  btnSign?: string;
  price?: number;
  img_url: string;
  isChosen: boolean;
  className?: string;
  btnAction?: () => void;
}) {
  const [descConceal, setDescConceal] = useState(true);

  const isLong = desc.length > 60;
  const descShort = desc.slice(0, 59) + "...";

  const handleReadBtnClick = (e: MouseEvent<HTMLButtonElement>)=> {
    e.stopPropagation();
    setDescConceal(p => !p);
  };

  return (
    <CardContainer>
      <CardBody 
        className={cn(
          s.body,
          className,
          "group/card"
        )}
        onClick={btnAction}
      >
        <CardItem
          translateZ="50"
          className={cn(
            s.title,
            isChosen 
              ? "text-amber-600" 
              : "text-neutral-600"
          )}
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className={s.desc}
        >
          {isLong &&
            <>
              {descConceal ? descShort : desc}
              <button 
                className={s.read_btn}
                onClick={handleReadBtnClick}
              >
                <span className={cn(
                  "z-20",
                  descConceal ? "text-yellow-600" : "text-red-700"
                )}>
                  {`Lire ${descConceal ? "plus" : "moins"}`}
                </span>
                <div />
              </button>
            </>
          }
          {!isLong && desc}
        </CardItem>
        <CardItem 
          translateZ="100" 
          className="w-full pt-4 h-60"
        >
          <Image
            src={img_url}
            height="300"
            width="300"
            className={cn(s.img, "group-hover/card:shadow-xl")}
            alt="thumbnail"
          />
        </CardItem>
        {btnSign &&
          <div className={s.bottom}>
            <CardItem
              translateZ={20}
              as="button"
              className={cn(s.price, "text-gold")}
            >
              <div className="flex items-start">
                {`${price}`}
                <span className="text-sm">€</span>
              </div>
            </CardItem>
            <CardItem
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
            </CardItem>
          </div>
        }
      </CardBody>
    </CardContainer>
  );
}
