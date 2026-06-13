"use client";
import s from "./style.module.scss";
import { useContext, useState } from "react";
import {
    ExpandBtn,
    BuyBtn,
    ServicesList
} from "./_components";
import { GlobalContext } from "@/app/context/global.context";
import { motion } from "framer-motion";
import { variantsOpacityAppearence } from "@/framer_templates/variants";
import { usePathname } from "next/navigation";

export const Basket = ()=> {
    const { servParams } = useContext(GlobalContext);
    const pathname = usePathname();
    const isHidden = pathname !== "/";

    const [isOpened, setIsOpened] = useState(false);
    const isNotEmpty = servParams.services_ids.length > 0;

    return (
        <motion.div
            hidden={isHidden}
            className={s.body}
            layout
            initial="start"
            whileInView="end"
            variants={variantsOpacityAppearence}
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