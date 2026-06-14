"use client";

import { GlobalContext } from "@/app/[locale]/context/global.context";
import { useContext } from "react";
import { CircularProgress } from "@mui/material";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { b612_bold } from "@/fonts/fonts";
import { Transition, motion } from "framer-motion";
import { useTranslations } from "next-intl";

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

    const chosenIds = servParams.services_ids;
    const chosenServices = services?.filter(s => chosenIds.includes(s.id))

    const DAYS_COUNT = Number(servParams.days_count) ?? 0;
    const VISITORS_COUNT = Number(servParams.visitors_count) ?? 0;
    const FINAL_MULTIPLIER = DAYS_COUNT * VISITORS_COUNT;
    const TOTAL_PRICE = chosenServices
        .map(svc=> svc.fixed_price 
            ? svc.price
            : svc.price * FINAL_MULTIPLIER
        )
        .reduce((acc, p)=> acc + p, 0);

    const transition: Transition = {
        type: "spring",
        stiffness: 260,
        damping: 20,
    }

    const variants = {
        start: {
            opacity: 0,
            y: 10
        },

        end: {
            opacity: 1,
            y: 0
        }
    };

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
                                {`${DAYS_COUNT}${t("daysShort")} x ${VISITORS_COUNT}${t("visitorsShort")} `}
                            </span>
                        }
                        <span className="text-gray-700">
                            {`${svc.fixed_price 
                                ? svc.price 
                                : svc.price * FINAL_MULTIPLIER}€`
                            }
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
