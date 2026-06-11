// Props
import { DetailedHTMLProps, HTMLAttributes } from "react";

export default interface BtnProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
    text: string
};