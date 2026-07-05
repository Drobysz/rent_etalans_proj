"use client";

import { PaymentInfoProps } from "./PaymentInfo.props";
import s from "./style.module.scss";
import { useTranslations } from "next-intl";
import {
    formatReservationCheckin,
    formatReservationCheckout,
} from "@/utils/reservationDateTime";

export const PaymentInfo = ({
    email,
    reserve_id,
    duration,
    visitors_count,
    reservation,
}: PaymentInfoProps)=> {
    const t = useTranslations("success");
    const displayCode = reservation?.code ?? reserve_id;
    const paymentBlocks = [
        { label: t("email"), content: email },
        { label: t("reservationCode"), content: displayCode },
        ...(!reservation ? [
            { label: t("duration"), content: t("durationValue", { count: duration }) },
            { label: t("visitors"), content: t("visitorsValue", { count: visitors_count }) },
        ] : []),
    ].filter((item) => item.content);
    const reservationBlocks = reservation ? [
        { label: t("apartment"), content: reservation.apartment },
        { label: t("rooms"), content: reservation.roomsCount ? t("roomsValue", { count: reservation.roomsCount }) : null },
        { label: t("guests"), content: reservation.guests ? t("visitorsValue", { count: reservation.guests }) : null },
        { label: t("checkin"), content: formatReservationCheckin(reservation.checkin) },
        { label: t("checkout"), content: formatReservationCheckout(reservation.checkout) },
    ].filter((item) => item.content) : [];

    return (
        <section className={s.body}>
            <div className={s.card}>
                {paymentBlocks.map((b, i)=>
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
            </div>
            {reservationBlocks.length > 0 && (
                <div
                    className={s.card}
                >
                    {reservationBlocks.map((item) => (
                        <div key={`reservation_${item.label}`}>
                            <span>{item.label}</span>
                            <span>{item.content}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
