"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { CursorCoordProps } from "../../types";
import s from "./style.module.scss";

export const Cursor = ({
    cursorCoord,
    isHidden
}: {
    cursorCoord: CursorCoordProps;
    isHidden: boolean;
})=> {
    const {left, top} = cursorCoord;

    return (
        <motion.div 
            className={s.cursor}
            animate={{
                left: left,
                top: top,
                opacity: isHidden ? 0 : 1,
            }}
        >
            <ArrowRight 
                className="w-3.5 h-3.5"
            />
        </motion.div>
    )
}