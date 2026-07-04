import {
    Hero,
    Menu,
    Articles,
    ScrollableText,
    Renting
} from "./_sections/index";
import s from "./page.module.scss";

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