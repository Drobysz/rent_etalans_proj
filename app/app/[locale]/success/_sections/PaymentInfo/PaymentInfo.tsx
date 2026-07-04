"use client";

import { PaymentInfoProps } from "./PaymentInfo.props";
import s from "./style.module.scss";
import { useTranslations } from "next-intl";

export const PaymentInfo = ({
    email,
    reserve_id,
    duration,
    visitors_count,
    reservation,
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
            {reservation && (
                <>
                    <div>
                        <span>{t("reservationDetails")}</span>
                        <span>{reservation.code ?? reserve_id}</span>
                    </div>
                    {[
                        { label: t("apartment"), content: reservation.apartment },
                        { label: t("rooms"), content: reservation.roomsCount ? t("roomsValue", { count: reservation.roomsCount }) : null },
                        { label: t("guests"), content: reservation.guests ? t("visitorsValue", { count: reservation.guests }) : null },
                        { label: t("checkin"), content: reservation.checkin },
                        { label: t("checkout"), content: reservation.checkout },
                        { label: t("nights"), content: reservation.nights ? t("durationValue", { count: reservation.nights }) : null },
                    ].filter((item) => item.content).map((item) => (
                        <div key={`reservation_${item.label}`}>
                            <span>{item.label}</span>
                            <span>{item.content}</span>
                        </div>
                    ))}
                </>
            )}
        </section>
    )
}
