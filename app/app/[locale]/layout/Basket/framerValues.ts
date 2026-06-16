import { Transition, Variants } from "framer-motion";

export const variants: Variants = {
    start: {
        opacity: 0,
        y: 20,
        scale: 0.98,
        pointerEvents: "none",
    },
    end: {
        opacity: 1,
        y: 0,
        scale: 1,
        pointerEvents: "auto",
        transition: {
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

export const transition: Transition = {
    height: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
    },
    opacity: {
        duration: 0.15,
    },
}