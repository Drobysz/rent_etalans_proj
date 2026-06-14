"use client";

import s from "./style.module.scss";
import { Loading } from "./loading";
import { Service } from "@/types";
import { ServiceCard } from "./ServiceCard";
import { useContext } from "react";
import { GlobalContext } from "@/app/[locale]/context/global.context";
import { getLocalizedServiceDescription } from "@/helpers";
import { useLocale, useTranslations } from "next-intl";

export const Cards = ()=> {
    const t = useTranslations("services");
    const locale = useLocale();
    const { 
        isServiceLoading: isLoading,
        serviceError: error,
        services,
        setMouseText
    } = useContext(GlobalContext);
    
    const MOUSE_GUIDE_TEXT = t("mouseGuide");

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
                    {t("fetchError")}
                </h2>
            }

            {!isLoading && services?.length === 0 && 
                <h2 className={s.error_title}>
                    {t("empty")}
                </h2>
            }

            {services && services.map((svc: Service, i: number)=> 
                <ServiceCard 
                    key={`service-${i}-${svc.id}`}
                    id={svc.id}
                    name={svc.name}
                    description={getLocalizedServiceDescription(svc, locale)}
                    images={svc.images}
                    fixed_price={svc.fixed_price}
                    visible={svc.visible}
                    price={svc.price}
                />
            )}
        </section>
    )
}
