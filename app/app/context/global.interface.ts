import { ServicesOrderParams } from "@/types";
import { Dispatch, SetStateAction } from "react";

export interface Coords {
    x: number;
    y: number;
}

export interface GlobalContextInterface {
    servParams: ServicesOrderParams;
    mouseGuide: Coords | null;
    mouseText: string;

    setServParams: Dispatch<SetStateAction<ServicesOrderParams>>;
    setMouseGuide: Dispatch<SetStateAction<Coords | null>>;
    setMouseText: Dispatch<SetStateAction<string>>;
}