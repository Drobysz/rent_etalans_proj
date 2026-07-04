import { Image } from "@/types";

export interface ImageSwitcherProps {
    images: Image[];
    nb_lits?: number;
    format3d?: boolean;
    imageCoverClassName?: string;
}