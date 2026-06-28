import { ReactNode } from "react";

export interface PriceProps {
    is3dCard: boolean;
    isFixedPrice: boolean;
    children: ReactNode;
    btnAction?: () => void;
}