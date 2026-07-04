import { Image } from "@/types";
import { Dispatch, SetStateAction } from "react";

export interface FeedProps {
    images: Image[];
    imageCoverClassName?: string;
    imgIdx: number;
    setImgIdx: Dispatch<SetStateAction<number>>;
}