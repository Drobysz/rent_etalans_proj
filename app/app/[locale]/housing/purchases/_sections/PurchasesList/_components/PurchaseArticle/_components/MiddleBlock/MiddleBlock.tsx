import { motion } from "framer-motion";
import { transitionBounce } from "@/framer_templates/transitions";
import { variantsOpacityAppearence } from "@/framer_templates/variants";
import { Payment, Service } from "@/types";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { b612_bold } from "@/fonts/fonts";
import { useTranslations } from "next-intl";
import {
    formatReservationCheckin,
    formatReservationCheckout,
} from "@/utils/reservationDateTime";

export const MiddleBlock = ({
    email,
    dateStr,
    services,
    payment,
}: {
    email: string;
    dateStr: string;
    services: Service[];
    payment: Payment;
})=> {
    const t = useTranslations("achats");
    const reservation = payment.reservation;
    const apartment = reservation?.apartment ?? payment.apartment;
    const reservationCode = payment.reservation_code ?? reservation?.reservation_code;
    const checkin = reservation?.checkin ?? payment.checkin;
    const checkout = reservation?.checkout ?? payment.checkout;
    const displayCheckin = formatReservationCheckin(checkin);
    const displayCheckout = formatReservationCheckout(checkout);
    const nights = reservation?.days_count ?? payment.days_count ?? payment.days_number;
    const guests = reservation?.guests ?? payment.client_number;
    const roomsCount = reservation?.rooms_count ?? apartment?.nb_chambers;
    const paymentStatus = payment.session_id ? t("paid") : reservation?.status;
    const hasReservation = Boolean(reservationCode || apartment || checkin || checkout || payment.apart_id);
    const hasServices = services.length > 0;
    const reservationRows = [
        [t("reservationCode"), reservationCode],
        [t("apartment"), apartment?.name],
        [t("rooms"), roomsCount],
        [t("guests"), guests],
        [t("checkin"), displayCheckin],
        [t("checkout"), displayCheckout],
        [t("nights"), nights],
        [t("paymentStatus"), paymentStatus],
        [t("purchaseDate"), dateStr],
    ].filter(([, value]) => value);

    return (
        <motion.div
            className="flex flex-col gap-4"

            initial={"start"}
            animate={"end"}

            variants={variantsOpacityAppearence}
            transition={transitionBounce}
        >
            <div className="flex flex-col">
                <span className={cn(
                    s.email,
                    b612_bold.className
                )}>
                    {email}
                </span>
                <span className={s.date}>
                    {dateStr}
                </span>
            </div>

            {hasReservation ? (
                <section className={s.purchase_section}>
                    <h3>{t("reservationSection")}</h3>
                    <dl className={s.details}>
                        {reservationRows.map(([label, value]) => (
                            <div key={`${label}_${value}`}>
                                <dt>{label}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ) : null}

            {hasServices ? (
                <section className={s.purchase_section}>
                    <h3>{t("servicesSection")}</h3>
                    <ul className={s.service_list}>
                        {services.map((svc, i)=>
                            <li
                                className={cn(
                                    s.res_serv,
                                    b612_bold.className
                                )}
                                key={`res_serv_${svc.id}_${i}`}
                            >
                                {`${svc.name}`}
                            </li>
                        )}
                    </ul>
                </section>
            ) : null}
        </motion.div>
    )
}
