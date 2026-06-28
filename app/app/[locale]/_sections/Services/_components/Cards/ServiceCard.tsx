"use client";

import { GlobalContext } from "@/app/[locale]/context/global.context";
import ThreeDCard from "@/components/3dCard/3dCard";
import { Service } from "@/types"
import { useContext } from "react";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { motion, Transition } from "framer-motion";
import { variantsOpacityAppearence } from "@/framer_templates/variants";;
import { useTranslations } from "next-intl";

export const ServiceCard = ({
    id,
    name,
    description,
    price,
    fixed_price,
    images
}: Service)=> {
    const t = useTranslations("services");
    const { 
        servParams, setServParams,
    } = useContext(GlobalContext);
    
    const services = servParams.services_ids;
    const isChosen = services.includes(id);
    const img_url = images[0].url;
    const customShadow = "shadow-[0_12px_40px_-8px_rgb(245,158,11,0.85)]";

    const transition: Transition = {
        type: "spring",
        stiffness: 260,
        damping: 20,
    }

    const handleClick = ()=> {
        if (isChosen) {
            setServParams({
                ...servParams,
                services_ids: [
                    ...services.filter(servId=> servId != id)
                ]
            });
        } else {
            setServParams({
                ...servParams,
                services_ids: [
                   ...services, id
                ]
            });
        }
    }

    return (
        <motion.div
            initial="start"
            whileInView="end"

            variants={variantsOpacityAppearence}
            transition={transition}
        >
            <ThreeDCard 
                title={name}
                desc={description}
                price={price}
                images={images}
                btnAction={handleClick}
                btnSign={isChosen ? t("remove") : t("add")}
                isChosen={isChosen}
                IsFixedPrice={fixed_price}
                btnStyle={cn(
                    s.default_btn,
                    isChosen && s.remove
                )}
                className={cn(
                    "cursor-pointer",
                    isChosen 
                        ? `border border-amber-400 ${customShadow}` 
                        : "border-black/10"
                )}
            />
        </motion.div>
    )
}
