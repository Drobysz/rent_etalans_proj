// Props
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { MotionValue } from "framer-motion";

export default interface ScrollParagraphProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    children: string,
    scrollYProgress: MotionValue<number>
};

