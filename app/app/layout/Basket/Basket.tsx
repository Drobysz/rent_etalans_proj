"use client";
import s from "./style.module.scss";
import { useContext, useState } from "react";
import {
    ExpandBtn,
    BuyBtn,
    ServicesList
} from "./_components";
import { GlobalContext } from "@/app/context/global.context";
import { motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

export const Basket = ()=> {
    const { servParams } = useContext(GlobalContext);
    const pathname = usePathname();
    const isHidden = pathname !== "/";

    const [isOpened, setIsOpened] = useState(false);
    const isNotEmpty = servParams.services_ids.length > 0;

    const variants: Variants = {
        start: {
            opacity: 0,
            y: 20,
            scale: 0.98,
        },
        end: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
            },
        },
        }

    return (
        <motion.div
            hidden={isHidden}
            className={s.body}
            layout
            initial="start"
            whileInView="end"
            variants={variants}
            transition={{
                height: {
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                },
                opacity: {
                    duration: 0.15,
                },
            }}
        >
            {isOpened && isNotEmpty && <ServicesList />}
            {isOpened &&!isNotEmpty &&
                <p className="text-gray-500 text-center">
                    Le panier est vide
                </p>
            }

            <div className={s.btns}>
                <ExpandBtn 
                    isOpened={isOpened}
                    setIsOpened={setIsOpened}
                />
                <BuyBtn 
                    isNotEmpty={isNotEmpty}
                />
            </div>
        </motion.div>
    )
}