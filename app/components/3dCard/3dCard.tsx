"use client";

import { 
  CardContainer as Card3dContainer, 
} from "@/components/ui/3d-card";
import {
  Title,
  Desc,
  Price,
  BuyBtn,
  Body,
} from "./_components";
import s from "./style.module.scss";
import { useWindowWidth } from "@/hooks";
import { Image } from "@/types";
import { ImageSwitcher } from "../ImageSwitcher/ImageSwitcher";

export default function ThreeDCard({
  title, desc, btnStyle,
  btnSign, price, images,
  className, isChosen, IsFixedPrice,
  btnAction
}: {
  title: string;
  desc: string;
  btnStyle?: string;
  btnSign?: string;
  price?: number;
  images: Image[];
  isChosen: boolean;
  IsFixedPrice: boolean;
  className?: string;
  btnAction?: () => void;
}) {
  const is3dCard = useWindowWidth(768) as boolean;
  const Container = is3dCard ? Card3dContainer : "article";

  return (
    <Container className="flex justify-center">
      <Body
        className={className}
        is3dCard={is3dCard}
        isChosen={isChosen}
        btnAction={btnAction}
      >
        <Title
          is3dCard={is3dCard}
          isChosen={isChosen}
        >
          {title}
        </Title>
        <Desc
          is3dCard={is3dCard}
          desc={desc}
        />
        <ImageSwitcher 
          images={images}
          format3d={is3dCard}
        />
        {btnSign &&
          <div className={s.bottom}>
            <BuyBtn
              is3dCard={is3dCard}
              btnStyle={btnStyle}
              btnAction={btnAction}
            >
              {btnSign}
            </BuyBtn>
            <Price
              is3dCard={is3dCard}
              isFixedPrice={IsFixedPrice}
              btnAction={btnAction}
            >
              {price}
            </Price>
          </div>
        }
      </Body>
    </Container>
  );
}
