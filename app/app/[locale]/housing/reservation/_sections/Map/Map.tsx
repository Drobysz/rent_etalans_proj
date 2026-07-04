import { useTranslations } from "next-intl";
import s from "./style.module.scss";

export const Map = ()=> {
    const t = useTranslations("reservation.map");

    return (
        <section className="flex flex-col gap-4 self-stretch max-[590px]:gap-2">
            <header className={s.header}>
                <h2 className={s.title}>
                    {t("title")}
                </h2>
                <p className={s.subtitle}>
                    {t("subtitle")}
                </p>
            </header>
            <div className={s.map}>
                <iframe 
                    src="https://shorturl.at/f6LFu" 
                    width="100%" 
                    height="400" 
                    style={{
                        border: 0
                    }}
                    allowFullScreen
                    loading="lazy" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                />
            </div>
        </section>
    )
}
