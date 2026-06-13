import { motion } from "framer-motion";
import { transitionBounce } from "@/framer_templates/transitions";
import { variantsOpacityAppearence } from "@/framer_templates/variants";
import { Service } from "@/types";
import s from "./style.module.scss";

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
                <span className={s.email}>
                    {email}
                </span>
                <span className={s.date}>
                    {dateStr}
                </span>
            </div>

            <ul className={s.service_list}>
                {services.map((svc, i)=>
                    <li
                        className={s.res_serv}
                        key={`res_serv_${s.id}_${i}`}
                    >
                        {`${svc.name}`}
                    </li>
                )}
            </ul>
        </motion.div>
    )
}