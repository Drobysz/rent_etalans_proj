import { inter_extrabold } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { Cards } from "./_components";
import s from "./style.module.scss";

export const Services = ()=> {
    return (
        <section className={s.section}>
            <h2 className={cn(
                s.title,
                inter_extrabold.className
            )}>
                Profitez de services qui rendront votre séjour encore plus agréable
            </h2>
            <Cards />
        </section>
    )
}
