import { Image } from "@/types";
import { Dispatch, SetStateAction } from "react";

export interface FeedProps {
    images: Image[];
    imageCoverClassName?: string;
    imgIdx: number;
    isImageLocale: boolean;
    setImgIdx: Dispatch<SetStateAction<number>>;
}