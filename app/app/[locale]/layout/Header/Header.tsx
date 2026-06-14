"use client"

import { cn } from "@/lib/utils";
import s from "./style.module.scss";
import { Navbar } from "@/components/animations/NavBar/NavBar"

export const Header = ({
    className
}: {
    className: string
}) => {
    return (
        <header className={cn(
            className,
            s.header
        )}>
            <div className={s.wrapper}>
                <Navbar /> 
            </div>
        </header>
    )
}
