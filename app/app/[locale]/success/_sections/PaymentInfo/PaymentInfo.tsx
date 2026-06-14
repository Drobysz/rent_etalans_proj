"use client";

import { PaymentInfoProps } from "./PaymentInfo.props";
import s from "./style.module.scss";
import { useTranslations } from "next-intl";

export const PaymentInfo = ({
    email,
    reserve_id,
    duration,
    visitors_count
}: PaymentInfoProps)=> {
    const t = useTranslations("success");
    const blocks = [
        { label: t("email"), content: email },
        { label: t("reservationCode"), content: reserve_id },
        { label: t("duration"), content: t("durationValue", { count: duration }) },
        { label: t("visitors"), content: t("visitorsValue", { count: visitors_count }) },
    ];

    return (
        <section className={s.body}>
            <div>
                <span>
                    {t("confirmationCode")}
                </span>
                <span>
                    {reserve_id}
                </span>
            </div>

            {blocks.map((b, i)=>
                <div
                    key={`payment_block_${i}_${b.content}`}
                >
                    <span>
                        {b.label}
                    </span>
                    <span>
                        {b.content}
                    </span>
                </div>
            )}
        </section>
    )
}
