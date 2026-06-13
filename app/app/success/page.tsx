import { createPayment } from "@/queries/createPayment";
import { getServices } from "@/queries/services";
import { validatePayment } from "@/queries/validatePayment";
import { redirect } from "next/navigation";
import s from "./style.module.scss";
import {
    ServicesList,
    PaymentInfo
} from "./_sections";
import { CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { Service } from "@/types";

type SuccessSearchParams = {
    session_id?: string;
};

export default async function SuccessPage ({
    searchParams
}: {
    searchParams: Promise<SuccessSearchParams>
}) {
    const {
        session_id,
    } = await searchParams;

    if (!session_id) {
        redirect('/cancel');
    }

    const validation = await validatePayment(session_id);

    if (!validation.valid || !validation.payment) {
        redirect('/cancel');
    }

    const {
        email,
        reserve_id,
        client_number: clientNumber,
        days_number: daysNumber,
        service_ids: serviceIds,
        total_price: totalPrice,
    } = validation.payment;

    await createPayment(
        email,
        reserve_id,
        clientNumber,
        daysNumber,
        totalPrice,
        serviceIds,
        session_id,
    );

    const services = await getServices();
    
    const filteredServices = services?.filter(
        (s: Service) => serviceIds.includes(s.id)
    ) ?? [];

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
                        Your payment was successfully processed
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
