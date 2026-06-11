"use client";

import { getServices } from "@/queries";
import s from "./style.module.scss";
import useSWR from "swr";
import { Loading } from "./loading";
import { Service } from "@/types";
import { ServiceCard } from "./ServiceCard";
import { useContext } from "react";
import { GlobalContext } from "@/app/context/global.context";

export const Cards = ()=> {
    const {
        data:services,
        isLoading,
        error
    } = useSWR(
        'services',
        getServices
    );
    
    const { setMouseText } = useContext(GlobalContext);
    const MOUSE_GUIDE_TEXT = "Cliquez sur la carte pour choisir l'option";

    const handleMouseEnter = ()=> {
        setMouseText(MOUSE_GUIDE_TEXT);
    };

    const handleMouseLeave = ()=> {
        setMouseText("");
    };

    return (
        <section 
            className={s.service_section}

            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isLoading && 
                <Loading/>
            }

            {error && 
                <h2 className={s.error_title}>
                    505 Failed to fetch services
                </h2>
            }

            {!isLoading && services?.length === 0 && 
                <h2 className={s.error_title}>
                    No items
                </h2>
            }

            {services && services.map((svc: Service, i: number)=> 
                <ServiceCard 
                    key={`service-${i}-${svc.id}`}
                    id={svc.id}
                    name={svc.name}
                    description={svc.description}
                    images={svc.images}
                    fixed_price={svc.fixed_price}
                    visible={svc.visible}
                    price={svc.price}
                />
            )}
        </section>
    )
}