"use client";

import { GlobalContext } from "@/app/[locale]/context/global.context";
import { Dispatch, SetStateAction, useContext } from "react";
import { CircularProgress } from "@mui/material";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { b612_bold } from "@/fonts/fonts";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BasketService } from "@/helpers/basket";
import { variants, transition } from "./framerValues";

export const ServicesList = ()=> {
    const t = useTranslations("basket");
    const {
        isServiceLoading: isLoading,
        serviceError: error,
        services,
        servParams
    } = useContext(GlobalContext);

    if (error || !services)
        return <p className="text-gray-500 text-center">{t("fetchError")}</p>;
    if (isLoading)
        return <CircularProgress size="3rem" color="inherit" />

    const chosenServices = BasketService
        .getChosenServices(servParams, services);
    const TOTAL_PRICE = BasketService.getTotalPrice(servParams, chosenServices);

    return (
        <motion.ul
            className={s.serv_list}
            initial="start"
            whileInView="end"
            variants={variants}
            transition={transition}
        >
            {chosenServices.map((svc, i)=> 
                <li
                    key={`chosen_service_${i}_${svc.id}`}
                    className={s.serv_block}
                >
                    <span className={cn(
                        b612_bold.className,
                        "text-lg text-gray-500"
                    )}>
                        {svc.name}
                    </span>

                    <div className="flex items-center gap-2">
                        {!svc.fixed_price &&
                            <span className="text-neutral-400 text-sm">
                                {BasketService.getMultipliersString(t, servParams)}
                            </span>
                        }
                        <span className="text-gray-700">
                            {`${BasketService.getPriceByType(svc, servParams)}€`}
                        </span>
                    </div>
                </li>
            )}
            <li className={s.serv_block}>
                <span className="font-bold text-2xl text-gray-700">
                    {t("total")}
                </span>
                <span className="text-lg font-bold text-gray-700">
                    {`${TOTAL_PRICE}€`}
                </span>
            </li>
        </motion.ul>
    )
}
