"use server";

import { createPayment, getServices, validatePayment } from "@/queries"
import { redirect } from "next/navigation";
import s from "./style.module.scss";
import {
    ServicesList,
    PaymentInfo
} from "./_sections";
import { CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { Service } from "@/types";

export default async function SuccessPage ({
    searchParams
}: {
    searchParams: Promise<{ 
        session_id: string;
        email: string;
        reserve_id: string;
        days_number: number;
        client_number: number;
        service_ids: string;
        total_price: number;
    }>
}) {
    const {
        session_id,
        email,
        reserve_id,
        days_number,
        client_number,
        total_price,
        service_ids
    } = await searchParams;

    const isValid = await validatePayment(session_id);
    const serviceIds = JSON.parse(service_ids).map(Number);

    if (isValid) {
        await createPayment(
            email,
            reserve_id,
            days_number,
            client_number,
            total_price,
            serviceIds,
        );
    } else {
        redirect('/cancel');
    }

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

                    <div className="flex justify-between px-3 items-center">
                        <PaymentInfo 
                            email={email}
                            duration={days_number}
                            visitors_count={client_number}
                            reserve_id={reserve_id}
                        />
                        <ServicesList 
                            services={filteredServices}
                            daysCount={days_number}
                            visitorsCount={client_number}
                        />
                    </div>
                </section>
            </div>
        </Suspense>
    )
}