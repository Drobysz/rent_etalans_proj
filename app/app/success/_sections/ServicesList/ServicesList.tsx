"use client";

import { variantsOpacityAppearence } from "@/framer_templates/variants";
import { transitionBounce } from "@/framer_templates/transitions";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { b612_bold } from "@/fonts/fonts";
import { motion } from "framer-motion";
import { Service } from "@/types";

export const ServicesList = ({
    services,
    daysCount,
    visitorsCount
}: {
    services: Service[];
    daysCount: number;
    visitorsCount: number;
})=> {
    const FINAL_MULTIPLIER = daysCount * visitorsCount;
    const TOTAL_PRICE = services
        .map(svc=> svc.fixed_price 
            ? svc.price
            : svc.price * FINAL_MULTIPLIER
        )
        .reduce((acc, p)=> acc + p, 0);

    return (
        <section className="flex flex-col gap-1">
            <motion.ul
                className={s.serv_list}
                initial="start"
                whileInView="end"
                variants={variantsOpacityAppearence}
                transition={transitionBounce}
            >
                {services.map((svc, i)=> 
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
                                    {`${daysCount}j x ${visitorsCount}vis `}
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
                        Total:
                    </span>
                    <span className="text-lg font-bold text-gray-700">
                        {`${TOTAL_PRICE}€`}
                    </span>
                </li>
            </motion.ul>
        </section>
    )
}