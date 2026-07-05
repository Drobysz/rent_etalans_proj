import s from "./page.module.scss";
import {
    UpperSection,
    Features,
    Map,
    ReservationForm
} from "./_sections";
import { ReservationContextProvider } from "./context/reservation.context";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return createPageMetadata(locale, "reservation", "/housing/reservation");
}

export default function ReservationPage () {
    return (
        <ReservationContextProvider>
            <div className={s.container}>
                <div className={s.wrapper}>
                    <UpperSection />
                    <hr className={s.divider} />
                    <Features />
                    <hr className={s.divider} />
                    <Map />
                </div>
                <ReservationForm />
            </div>
        </ReservationContextProvider>
    )
}
