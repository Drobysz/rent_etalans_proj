'use client';

import { ReactNode } from 'react';
import ScrollParagraphProps from './ScrollParagraph.props';
import { motion, MotionValue, useTransform } from 'framer-motion';


export const ScrollParagraph = ({children, className, scrollYProgress }: ScrollParagraphProps) => {
    const words = children
        .trim()
        .replace(/\s+/g, " ")
        .split(" ");
    const len = words.length;

    return (
        <p className={className}>
            {
                words.map( (w : string, idx: number) => {
                    const start = idx / len;
                    const end = start + (1 / len)

                    return (
                        <Word 
                            range={[start, end]} 
                            scrollYProgress={scrollYProgress} 
                            key={idx}
                        >
                                {w}
                        </Word>
                    );
                } )
            }
        </p>
    );
};


const Word = ({
    children, 
    range, 
    scrollYProgress
}: {
    children: ReactNode, 
    range: [start: number, end: number], 
    scrollYProgress: MotionValue<number> 
}) => {
    const color = useTransform(scrollYProgress, range, ["#d4d4d4", "#171717"]);

    return (
        <motion.span
            className='inline-block'
            style={{ color }}
        >
            {children}
        </motion.span>
    );
};
