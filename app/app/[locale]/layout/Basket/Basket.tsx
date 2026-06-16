"use client";

import s from "./style.module.scss";
import { useContext, useEffect, useState } from "react";
import {
    ExpandBtn,
    BuyBtn,
    ServicesList
} from "./_components";
import { GlobalContext } from "@/app/[locale]/context/global.context";
import { motion, useAnimationControls, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { variants, transition } from "./framerValues";
import { BasketService } from "@/helpers/basket";
import { useWindowWidth } from "@/hooks";

export const Basket = ()=> {
    const t = useTranslations("basket");
    const { 
        servParams,
        services,
        isServiceLoading: isLoading,
    } = useContext(GlobalContext);
    const pathname = usePathname();

    const [isConcealed, setIsConcealed] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const isNotEmpty = servParams.services_ids.length > 0;

    const isFullWidth = useWindowWidth(480) as boolean;
    const isBasketHidden = pathname !== "/" || !services
        || isLoading || isConcealed ;
    const chosenServices = BasketService.getChosenServices(servParams, services ?? []);
    const TOTAL_PRICE = BasketService.getTotalPrice(servParams, chosenServices);
    const isTotalPriceHidden = isFullWidth || TOTAL_PRICE <= 0;

    const { scrollYProgress } = useScroll();
    const controls = useAnimationControls();

    useMotionValueEvent(scrollYProgress, "change", (latest)=> {
        if (latest > 0.95) {
            setIsConcealed(true);
        } else {
            setIsConcealed(false);
        }
    })

    useEffect(()=> {
        if (!isBasketHidden) {
            controls.start("end");
            return;
        }

        const timeOutId = setTimeout(
            ()=> controls.start("start"),
            100
        );

        return ()=> clearTimeout(timeOutId);
    }, [isBasketHidden, controls])

    return (
        <motion.div
            className={s.body}
            layout
            initial="start"
            animate={controls}
            variants={variants}
            transition={transition}
        >
            {isOpened && isNotEmpty && 
                <ServicesList />
            }
            {isOpened &&!isNotEmpty &&
                <p className="text-gray-500 text-center">
                    {t("empty")}
                </p>
            }

            <div className={s.btns}>
                <ExpandBtn 
                    isOpened={isOpened}
                    setIsOpened={setIsOpened}
                />
                <p
                    hidden={isTotalPriceHidden} 
                    className="flex flex-col"
                >
                    <span className="font-bold text-neutral-900">
                        Total price: 
                    </span>
                    <span className="text-neutral-600">
                        {`${TOTAL_PRICE}€`}
                    </span>
                </p>
                <BuyBtn 
                    isNotEmpty={isNotEmpty}
                />
            </div>
        </motion.div>
    )
}
