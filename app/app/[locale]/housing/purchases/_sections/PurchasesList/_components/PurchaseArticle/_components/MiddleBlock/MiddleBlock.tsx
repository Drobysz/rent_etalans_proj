import { motion } from "framer-motion";
import { transitionBounce } from "@/framer_templates/transitions";
import { variantsOpacityAppearence } from "@/framer_templates/variants";
import { Payment, Service } from "@/types";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { b612_bold } from "@/fonts/fonts";
import { useTranslations } from "next-intl";

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
    const nights = reservation?.days_count ?? payment.days_count ?? payment.days_number;
    const guests = reservation?.guests ?? payment.client_number;
    const roomsCount = reservation?.rooms_count ?? apartment?.nb_chambers;

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

            <ul className={s.service_list}>
                {services.map((svc, i)=>
                    <li
                        className={cn(
                            s.res_serv,
                            b612_bold.className
                        )}
                        key={`res_serv_${s.id}_${i}`}
                    >
                        {`${svc.name}`}
                    </li>
                )}
            </ul>
            {reservationCode || payment.apart_id ? (
                <dl className={s.details}>
                    {[
                        [t("reservationCode"), reservationCode],
                        [t("apartment"), apartment?.name],
                        [t("checkin"), checkin],
                        [t("checkout"), checkout],
                        [t("nights"), nights],
                        [t("guests"), guests],
                        [t("rooms"), roomsCount],
                        [t("paymentStatus"), payment.session_id ? t("paid") : undefined],
                    ].filter(([, value]) => value).map(([label, value]) => (
                        <div key={`${label}_${value}`}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            ) : null}
        </motion.div>
    )
}
