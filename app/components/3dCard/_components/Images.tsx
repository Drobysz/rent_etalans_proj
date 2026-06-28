"use client";

import {
  ImageSwitcher
} from "@/components/ImageSwitcher/ImageSwitcher"
import { Image } from "@/types";

export const Images = ({
    imgs,
    is3dCard
}: {
    imgs: Image[];
    is3dCard: boolean;
})=> {

    return (
      <ImageSwitcher 
        images={imgs}
        format3d={is3dCard}
      />
    )
}