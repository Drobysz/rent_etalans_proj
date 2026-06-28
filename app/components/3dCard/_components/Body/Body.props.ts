import { ReactNode } from "react";

export interface BodyProps {
    className?: string;
    children: ReactNode;
    is3dCard: boolean;
    isChosen: boolean;
    btnAction?: ()=> void;
}