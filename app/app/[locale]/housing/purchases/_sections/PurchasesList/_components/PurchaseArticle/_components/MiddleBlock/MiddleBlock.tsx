import { motion } from "framer-motion";
import { transitionBounce } from "@/framer_templates/transitions";
import { variantsOpacityAppearence } from "@/framer_templates/variants";
import { Service } from "@/types";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { b612_bold } from "@/fonts/fonts";

export const MiddleBlock = ({
    email,
    dateStr,
    services
}: {
    email: string;
    dateStr: string;
    services: Service[]
})=> {
    return (
        <motion.div
            className="flex flex-col gap-4"

            initial={"start"}
            animate={"end"}

            variants={variantsOpacityAppearence}
            transition={transitionBounce}
        >
            <div className="flex flex-col">
                <span className={cn(
                    s.email,
                    b612_bold.className
                )}>
                    {email}
                </span>
                <span className={s.date}>
                    {dateStr}
                </span>
            </div>

            <ul className={s.service_list}>
                {services.map((svc, i)=>
                    <li
                        className={cn(
                            s.res_serv,
                            b612_bold.className
                        )}
                        key={`res_serv_${s.id}_${i}`}
                    >
                        {`${svc.name}`}
                    </li>
                )}
            </ul>
        </motion.div>
    )
}