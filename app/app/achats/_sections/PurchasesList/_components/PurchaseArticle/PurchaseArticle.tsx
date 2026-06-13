"use client";

import { Payment } from "@/types";
import s from "./style.module.scss";
import { motion } from "framer-motion";
import { useState } from "react";
import { transitionBounce } from "@/framer_templates/transitions";
import { convertToUTCDateFormat } from "@/helpers";
import {
    TitleBlock,
    MiddleBlock
} from "./_components";

export const PurchaseArticle = ({
    payment
}: {
    payment: Payment
})=> {
    const [isOpened, setIsOpened] = useState(false);
    const dateStr = convertToUTCDateFormat(payment.created_at ?? "unknown");

    return (
        <motion.li
            layout
            className={s.res_block}
            transition={transitionBounce}
        >
            <TitleBlock 
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                reserve_id={payment.reserve_id}
                total_price={payment.total_price}
            />
            {isOpened &&
                <MiddleBlock 
                    email={payment.email}
                    dateStr={dateStr}
                    services={payment.services ?? []}
                />
            }
        </motion.li>
    )
}