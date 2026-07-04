import {
    Wifi, SquareParking, TvMinimal,
    Heater, FlameKindling, TowelRack,
    AirVent, WashingMachine, ShowerHead
} from "lucide-react";
import s from "./style.module.scss";

export const Features = ()=> {
    const featuresList = [
        { label: "Wifi", Icon: Wifi },
        { label: "Parking: 2 places", Icon: SquareParking },
        { label: "TV Full HD", Icon: TvMinimal },

        { label: "Central Heating", Icon: Heater },
        { label: "Fire pit", Icon: FlameKindling },
        { label: "Bedding", Icon: TowelRack },

        { label: "Air Conditioner", Icon: AirVent },
        { label: "Washing machine", Icon: WashingMachine },
        { label: "Outdoor shower", Icon: ShowerHead },
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