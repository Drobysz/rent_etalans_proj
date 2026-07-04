import s from "./style.module.scss";

export const Map = ()=> {
    return (
        <section className="flex flex-col gap-4 self-stretch max-[590px]:gap-2">
            <header className={s.header}>
                <h2 className={s.title}>
                    Where is the apartment located?
                </h2>
                <p className={s.subtitle}>
                    Étalans, Bourgogne-Franche-Comté, France
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