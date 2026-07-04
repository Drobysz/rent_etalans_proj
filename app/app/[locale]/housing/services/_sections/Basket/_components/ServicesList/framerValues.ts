import { Transition } from "framer-motion";

export const transition: Transition = {
        type: "spring",
        stiffness: 260,
        damping: 20,
    }

export const variants = {
    start: {
        opacity: 0,
        y: 10
    },

    end: {
        opacity: 1,
        y: 0
    }
};