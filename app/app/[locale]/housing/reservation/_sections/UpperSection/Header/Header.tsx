import { cn } from "@/lib/utils";
import s from "../style.module.scss";
import { bilbo_swash_caps } from "@/fonts/fonts";

export const Header = ()=> {
    return (
        <header className={s.header}>
            <h1 className={cn(
                bilbo_swash_caps.className,
                s.title
            )}>
                Au calme de la campagne
            </h1>
            <p className={s.subtitle}>
                1-4 visitors ○ 1-2 rooms ○ 1-2 beds
            </p>
        </header>
    )
}