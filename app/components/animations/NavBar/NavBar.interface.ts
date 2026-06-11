import { ReactNode } from "react";

export interface CursorPosition {
    left: number;
    width: number;
};

export interface CursorProps {
    position: CursorPosition;
};

export interface Tabprops {
    children: ReactNode;
    href: string;
    isActive: boolean;
    setPosition: ( PosProps : CursorPosition )=> void;
    setPositionClicked: ( PosProps : CursorPosition )=> void;
};