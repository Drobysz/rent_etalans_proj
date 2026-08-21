"use client";

import { Tag } from "../types";
import { useEffect, useId, useRef } from "react";
import { animate, motion, stagger, useInView } from "framer-motion";
import SplitType from "split-type";

export const SplitByRowsText = ({
    tag,
    children,
    className,
}: {
    tag: Tag;
    children: string;
    className?: string;
})=> {
    const motionTags = {
        h1: motion.h1,
        h2: motion.h2,
        h3: motion.h3,
        h4: motion.h4,
        h5: motion.h5,
        h6: motion.h6,
        p: motion.p,
        span: motion.span,
    } as const;

    const MotionTag = motionTags[tag];
    const tagId = useId();
    const parentRef = useRef<HTMLSpanElement | null>(null);
    const linesRef = useRef<HTMLElement[]>([]);
    const lineClass = `split-line-${tagId}`;

    const isInView = useInView(parentRef, {
        once: true,
        amount: 0.3
    })

    useEffect(()=> {
        if (!parentRef.current) return;

        const split = new SplitType(parentRef.current, {
            types: "lines",
            lineClass: lineClass
        });

        split.lines?.forEach(line => {
            const wrapper = document.createElement("div");

            wrapper.style.overflow = "hidden";
            line.style.transformOrigin = "left bottom";
            
            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
        });

        linesRef.current = split.lines ?? [];

        return ()=> {
            split.revert();
            linesRef.current = []
        }
    }, [children, lineClass])

    useEffect(()=> {
        if (!isInView || !linesRef.current.length) return;

        const controls = animate(
            "." + lineClass,
            {

                y: ["80%", "0%"],
                rotate: [35, 0]
            },
            {
                duration: 0.7,
                delay: stagger(0.12),
                ease: [0.16, 1, 0.3, 1],
            }
        );

        return ()=> {
            controls.stop();
        }
    }, [isInView, lineClass])

    return (
        <MotionTag
            className={className}
        >
            <span
                ref={parentRef}
            >
                {children}
            </span>
        </MotionTag>
    )
}