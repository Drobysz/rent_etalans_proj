import {
    Wifi, SquareParking, TvMinimal,
    Heater, FlameKindling, TowelRack,
    AirVent, Refrigerator, ShowerHead
} from "lucide-react";
import { useTranslations } from "next-intl";
import s from "./style.module.scss";
import { ViewReveal } from "@/components/animations/ViewReveal/ViewReveal";

export const Features = ()=> {
    const t = useTranslations("reservation.features");
    const featuresList = [
        { label: t("wifi"), Icon: Wifi },
        { label: t("parking"), Icon: SquareParking },
        { label: t("tv"), Icon: TvMinimal },

        { label: t("heating"), Icon: Heater },
        { label: t("grill"), Icon: FlameKindling },
        { label: t("bedding"), Icon: TowelRack },

        { label: t("airConditioner"), Icon: AirVent },
        { label: t("refrigerator"), Icon: Refrigerator },
        { label: t("shower"), Icon: ShowerHead },
    ];

    return (
        <ViewReveal
            as="section"
        >
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
        </ViewReveal>
    )
}
