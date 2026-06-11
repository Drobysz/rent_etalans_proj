import { ServicesOrderParams } from "@/types";
import { DetailedHTMLProps, Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import { CursorPosition } from "../../types";

export interface StayInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    formId: number;
    isFocused: boolean;
    isSectActive: boolean;
    label: string;
    className?: string;
    param: keyof ServicesOrderParams;
    setPosition: ( PosProps : CursorPosition )=> void;
    currFormId: number | null;
    setCurrFormId: Dispatch<SetStateAction<number | null>>;
}