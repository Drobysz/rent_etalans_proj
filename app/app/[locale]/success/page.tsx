import { createPayment } from "@/queries/createPayment";
import { getServices } from "@/queries/services";
import { validatePayment } from "@/queries/validatePayment";
import { redirect } from "@/i18n/navigation";
import s from "./style.module.scss";
import {
    ServicesList,
    PaymentInfo
} from "./_sections";
import { CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { Service } from "@/types";
import { getTranslations } from "next-intl/server";

type SuccessSearchParams = {
    session_id?: string;
};

export default async function SuccessPage ({
    searchParams,
    params,
}: {
    searchParams: Promise<SuccessSearchParams>;
    params: Promise<{ locale: string }>;
}) {
    const {
        session_id,
    } = await searchParams;
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "success" });

    if (!session_id) {
        return redirect({ href: "/cancel", locale });
    }

    const validation = await validatePayment(session_id);

    if (!validation.valid || !validation.payment) {
        return redirect({ href: "/cancel", locale });
    }

    const {
        email,
        reserve_id,
        client_number: clientNumber,
        days_number: daysNumber,
        service_ids: serviceIds,
        total_price: totalPrice,
    } = validation.payment;

    const services = await getServices();

    const filteredServices = services?.filter(
        (s: Service) => serviceIds.includes(s.id)
    ) ?? [];

    const serviceNames = filteredServices.map((service: Service) => service.name);

    await createPayment(
        email,
        reserve_id,
        clientNumber,
        daysNumber,
        totalPrice,
        serviceIds,
        serviceNames,
        session_id,
    );

    return (
        <Suspense
            fallback={
                <CircularProgress 
                    className="text-amber-400"
                    size="3rem"
                />
            }
        >
            <div className={s.space}>
                <section className="flex flex-col gap-4">
                    <h1 className={s.title}>
                        {t("title")}
                    </h1>

                    <div className="flex flex-col gap-4 px-3 md:flex-row md:items-start md:justify-between">
                        <PaymentInfo 
                            email={email}
                            duration={daysNumber}
                            visitors_count={clientNumber}
                            reserve_id={reserve_id}
                        />
                        <ServicesList 
                            services={filteredServices}
                            daysCount={daysNumber}
                            visitorsCount={clientNumber}
                            email={email}
                            reserveId={reserve_id}
                            sessionId={session_id}
                            totalPrice={totalPrice}
                        />
                    </div>
                </section>
            </div>
        </Suspense>
    )
}
