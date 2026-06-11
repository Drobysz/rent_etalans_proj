"use client";

import { CursorProps } from "../../types";
import { motion } from "framer-motion";
import s from "./style.module.scss";

export const Cursor = ({ 
    position,
    isActive
}: CursorProps)=> {
    return (
        <motion.span
            initial={{
                ...position,
                scale: 0.8,
                opacity: 0,
            }}
            animate={{
                ...position,
                scale: isActive ? 1 : 0.8,
                opacity: isActive ? 1 : 0,
            }}
            className={s.cursor}
        />
    )
}