import { motion } from "framer-motion";
import { CursorProps } from "../NavBar.interface";

export const Cursor = ({ position }: CursorProps)=> {
    return (
        <motion.span
            animate={{
                ...position,
            }}
            className="absolute z-0 h-8 rounded-4xl bg-amber-200/50 backdrop-blur-xs"
        />
    );
};