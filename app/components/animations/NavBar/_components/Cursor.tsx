import { motion } from "framer-motion";
import { CursorProps } from "../types";

export const Cursor = ({ position }: CursorProps)=> {
    return (
        <motion.span
            animate={{
                ...position,
            }}
            className="absolute z-0 h-8 rounded-4xl bg-amber-200/50 backdrop-blur-xs max-[560px]:h-6"
        />
    );
};
