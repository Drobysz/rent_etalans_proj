import s from "./page.module.scss";
import {
    UpperSection,
    Features,
    Map,
    ReservationForm
} from "./_sections";
import { ReservationContextProvider } from "./context/reservation.context";

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
