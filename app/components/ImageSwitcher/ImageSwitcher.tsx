'use client';

import { useState } from "react";
import { ImageSwitcherProps } from "./ImageSwitcher.props"
import s from "./style.module.scss";
import { 
    Switchers,
    ImageCover,
    CardPagination,
    Feed,
} from "./_components";

import { 
  CardItem as Card3dItem,
  DefaultItem
} from "@/components/ui/3d-card";
import { PathService } from "@/helpers/path";

export const ImageSwitcher = ({
    images,
    nb_lits,
    format3d = false,
    imageCoverClassName,
    isImageLocal = false
}: ImageSwitcherProps) => {
    const isImage = images.length > 0;
    const [imgIdx, setImgIdx] = useState(0);
    const [hover, setHover] = useState(false);

    const Item = format3d ? Card3dItem : DefaultItem;

    return (
        <Item
            translateZ="100"  
            className={s.image_switcher}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {nb_lits &&
                <span className={s.tag}>
                    {nb_lits} bed{nb_lits > 1 ? "s" : ""}
                </span>
            }
            {!isImage && 
                <ImageCover
                    className={imageCoverClassName}
                    url={PathService.withBasePath("/empty.png")}
                /> 
            } 

            {isImage && 
                <Feed 
                    imgIdx={imgIdx}
                    setImgIdx={setImgIdx}
                    images={images}
                    isImageLocale={isImageLocal}
                    imageCoverClassName={imageCoverClassName}
                />
            }
            {images.length > 1 && (
                <>
                    <Switchers 
                        imgIdx={imgIdx}
                        setImgIdx={setImgIdx}
                        lastIdx={images.length - 1}
                        hover={hover}
                    />
                    <CardPagination
                        qntty={images.length}
                        hover={hover}
                        imgIdx={imgIdx}
                        setImgIdx={setImgIdx}
                    />
                </>
            )}
        </Item>
    );
}
