import s from "./page.module.scss";
import {
    UpperSection,
    Features,
    Map
} from "./_sections";

export default function ReservationPage () {
    return (
        <div className={s.container}>
            <div className={s.wrapper}>
                <UpperSection />
                <hr className={s.divider} />
                <Features />
                <hr className={s.divider} />
                <Map />
            </div>
        </div>
    )
}