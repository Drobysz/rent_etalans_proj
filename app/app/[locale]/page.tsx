import {
    Hero,
    Menu,
    Articles,
    ScrollableText,
    Renting
} from "./_sections/index";
import s from "./page.module.scss";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return createPageMetadata(locale, "home", "/");
}

export default async function HomePage() {
    return (
        <div 
            className={s.page}
        >
            <Hero />
            <Articles />
            <Menu />
            <ScrollableText />
            <Renting />
        </div>
    )
}
