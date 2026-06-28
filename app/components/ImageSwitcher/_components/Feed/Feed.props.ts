import { Image } from "@/types";
import { Dispatch, SetStateAction } from "react";

export interface FeedProps {
    images: Image[];
    imgIdx: number;
    setImgIdx: Dispatch<SetStateAction<number>>;
}