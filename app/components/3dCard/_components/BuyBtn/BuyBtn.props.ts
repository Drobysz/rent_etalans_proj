import { ReactNode } from "react";

export interface BuyBtnProps {
    is3dCard: boolean;  
    btnStyle?: string;
    btnAction?: ()=> void;
    children: ReactNode;
}