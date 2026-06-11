import { inter_extrabold } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { Cards } from "./_components";

export const Services = ()=> {
    return (
        <section>
            <h2 className={cn(
                "text-gold text-center text-3xl",
                inter_extrabold.className
            )}>
                Profitez de services qui rendront votre séjour encore plus agréable
            </h2>
            <Cards />
        </section>
    )
}