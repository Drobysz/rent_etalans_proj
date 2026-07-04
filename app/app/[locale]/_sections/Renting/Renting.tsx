"use client";

import s from "./style.module.scss";
import { PathService } from "@/helpers/path";
import Image from "next/image";
import { useWindowWidth } from "@/hooks";
import { Note } from "./Note/Note";

export const Renting = ()=> {
    const isDesktop = useWindowWidth(770) as boolean;

    return (
        <section className={s.container}>
            <div className={s.inner_content}>
                <header className={s.header}>
                    <h2 className={s.title}>
                        Pointet Family
                    </h2>
                    {isDesktop && <Note />}
                </header>
                <Image
                    src={PathService.withBasePath("/house/salon.jpg")}
                    className={s.salon_cover}
                    width={400}
                    height={250}
                    alt="apartment illustration"
                />
                {!isDesktop && <Note />}
            </div>
        </section>
    )
}