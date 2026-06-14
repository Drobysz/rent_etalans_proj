"use client";

import { variantsOpacityAppearence } from "@/framer_templates/variants";
import { transitionBounce } from "@/framer_templates/transitions";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { b612_bold } from "@/fonts/fonts";
import { motion } from "framer-motion";
import { Service } from "@/types";
import {
    DownloadInvoiceButton,
    DownloadStripeInvoiceButton
} from "../../_components";
import type { InvoiceServiceItem } from "@/utils/createInvoicePdf";
import { useTranslations } from "next-intl";

export const ServicesList = ({
    services,
    daysCount,
    visitorsCount,
    email,
    reserveId,
    sessionId,
    totalPrice
}: {
    services: Service[];
    daysCount: number;
    visitorsCount: number;
    email: string;
    reserveId: string;
    sessionId: string;
    totalPrice: number;
})=> {
    const t = useTranslations("success");
    const FINAL_MULTIPLIER = daysCount * visitorsCount;
    const invoiceServices: InvoiceServiceItem[] = services.map((svc) => {
        const quantity = svc.fixed_price ? 1 : FINAL_MULTIPLIER;

        return {
            id: svc.id,
            title: svc.name,
            quantity,
            unitPrice: svc.price,
            amount: svc.price * quantity,
        };
    });

    return (
        <section className={s.body}>
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
                                    {`${daysCount}${t("daysShort")} x ${visitorsCount}${t("visitorsShort")} `}
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
                        {`${totalPrice}€`}
                    </span>
                </li>
            </motion.ul>
            <div className={s.actions}>
                <DownloadStripeInvoiceButton sessionId={sessionId} />
                <DownloadInvoiceButton
                    email={email}
                    reserveId={reserveId}
                    daysNumber={daysCount}
                    visitorsNumber={visitorsCount}
                    totalPrice={totalPrice}
                    services={invoiceServices}
                />
            </div>
        </section>
    )
}
