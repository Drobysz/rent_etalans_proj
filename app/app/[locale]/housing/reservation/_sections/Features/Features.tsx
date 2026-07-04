import {
    Wifi, SquareParking, TvMinimal,
    Heater, FlameKindling, TowelRack,
    AirVent, WashingMachine, ShowerHead
} from "lucide-react";
import { useTranslations } from "next-intl";
import s from "./style.module.scss";

export const Features = ()=> {
    const t = useTranslations("reservation.features");
    const featuresList = [
        { label: t("wifi"), Icon: Wifi },
        { label: t("parking"), Icon: SquareParking },
        { label: t("tv"), Icon: TvMinimal },

        { label: t("heating"), Icon: Heater },
        { label: t("firePit"), Icon: FlameKindling },
        { label: t("bedding"), Icon: TowelRack },

        { label: t("airConditioner"), Icon: AirVent },
        { label: t("washingMachine"), Icon: WashingMachine },
        { label: t("outdoorShower"), Icon: ShowerHead },
    ];

    return (
        <section>
            <ul className={s.features_list}>
                {featuresList.map((
                    {Icon, label}, idx
                )=> 
                    <li
                        key={`feature-${idx}`}
                        className={s.feature}
                    >
                        <Icon 
                            className="text-neutral-700"
                        />
                        <span>
                            {label}
                        </span>
                    </li>
                )}
            </ul>
        </section>
    )
}
