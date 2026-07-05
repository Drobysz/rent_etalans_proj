import { createPayment } from "@/queries/createPayment";
import { getApartments } from "@/queries/apartments";
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
import { PaymentStorageSync } from "./_components";
import type { InvoiceApartmentItem } from "@/utils/createInvoicePdf";

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
        days_count: daysCount,
        reservation_id: reservationId,
        reservation_code: reservationCode,
        apart_id: apartmentId,
        rooms_count: roomsCount,
        checkin,
        checkout,
        service_ids: serviceIds,
        total_price: totalPrice,
    } = validation.payment;

    const [services, apartments] = await Promise.all([
        getServices(),
        getApartments().catch(() => []),
    ]);

    const filteredServices = services?.filter(
        (s: Service) => serviceIds.includes(s.id)
    ) ?? [];
    const selectedApartment = apartments.find((apartment) => apartment.id === apartmentId);

    const serviceNames = filteredServices.map((service: Service) => service.name);
    const reservationNights = daysCount ?? daysNumber;
    const invoiceApartment: InvoiceApartmentItem | undefined = apartmentId && selectedApartment && checkin && checkout
        ? {
            title: selectedApartment.name,
            roomsCount: roomsCount ?? selectedApartment.nb_chambers,
            guests: clientNumber,
            checkin,
            checkout,
            nights: reservationNights,
            pricePerNight: selectedApartment.price,
            amount: selectedApartment.price * reservationNights,
        }
        : undefined;

    const payment = await createPayment(
        email,
        reserve_id,
        clientNumber,
        daysNumber,
        totalPrice,
        serviceIds,
        serviceNames,
        session_id,
        {
            reservation_id: reservationId,
            reservation_code: reservationCode,
            apart_id: apartmentId,
            checkin,
            checkout,
            days_count: daysCount ?? daysNumber,
        },
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
            <PaymentStorageSync payment={payment} />

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
                            reservation={apartmentId ? {
                                code: reservationCode,
                                apartment: selectedApartment?.name,
                                roomsCount,
                                guests: clientNumber,
                                checkin,
                                checkout,
                                nights: reservationNights,
                            } : undefined}
                        />
                        <ServicesList 
                            services={filteredServices}
                            daysCount={daysNumber}
                            visitorsCount={clientNumber}
                            email={email}
                            reserveId={reservationCode ?? reserve_id}
                            sessionId={session_id}
                            totalPrice={totalPrice}
                            apartment={invoiceApartment}
                        />
                    </div>
                </section>
            </div>
        </Suspense>
    )
}
