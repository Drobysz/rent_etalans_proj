"use client";

import { useId } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { SplitTextProps } from "./SplitText.props";
import { Tag } from "../types";
import { motionTags } from "./motionTags";
import type { ComponentType } from "react";

export const SplitText = <T extends Tag>({
    tag,
    children,
    className,
    animationType = "blurred",
    viewportAmount = 0.3,
    delayChildren,
    ...props
}: SplitTextProps<T>)=> {
    const words = children.split(" ");
    const MotionTag = motionTags[tag] as ComponentType<
        Omit<HTMLMotionProps<T>, "ref">
    >;
    const motionProps = props as Omit<HTMLMotionProps<T>, "ref">;
    const tagId = useId();

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.23,
                delayChildren: delayChildren ?? 0
            },
        },
    };

    const wordVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.03,
            },
        },
    };

    const animVariants = {
        "unwrapping": {
            hidden: {
                filter: "blur(3px)",
                y: 50,
                rotate: 45,
            },

            visible: {
                filter: "blur(0px)",
                y: 0,
                rotate: 0,
            },
        },
        "blurred": {
            hidden: {
                filter: "blur(7px)",
                y: 8,
                opacity: 0,
                scale: 0.7,
            },

            visible: {
                filter: "blur(0px)",
                y: 0,
                opacity: 1,
                scale: 1
            },
        }
    }

    const charVariants = animVariants[animationType];

    return (
        <MotionTag
            {...motionProps}
            className={cn(className, "inline-block")}
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: true,
                amount: viewportAmount,
            }}
            variants={containerVariants}
        >
            {words.map((w, wId)=> 
                <motion.span
                    key={`${tagId}_w_${wId}`}
                    className="inline-block overflow-hidden"
                    variants={wordVariants}
                >
                    {w.split("").map((c, cId)=>
                            <motion.span
                                key={`${tagId}_${wId}_c_${cId}`}
                                className="inline-block"
                                variants={charVariants}
                                transition={{
                                    // delay: wId * 0.25 + cId * 0.035,
                                    duration: 0.25,
                                    ease: [0.33, 1, 0.68, 1]
                                }}
                            >
                                {(c === " " ? "\u00A0" : c)}
                            </motion.span>
                    )}
                    <span>&nbsp;</span>
                </motion.span>
            )}
        </MotionTag>
    )
}
