"use client";

import { ArticleCard } from "./ArticleCard/ArticleCard";
import s from "./style.module.scss";
import articles from "./articlesData";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { SplitText } from "@/components/animations/Texts/SplitText/SplitText";

export const Articles = ()=> {
    const [hover, setHover] = useState(false);
    const t = useTranslations("home.articles");

    return (
        <section className="flex flex-col gap-4">
            <header className="flex flex-col gap-5">
                <div className="px-3">
                    <hr 
                        className={s.line}
                    />
                </div>
                <SplitText 
                    className={s.title}
                    tag="h2"
                    animationType="unwrapping"
                >
                    {t("title")}
                </SplitText>
            </header>
            <div 
                className={s.articles}
                onMouseEnter={()=> setHover(true)}
                onMouseLeave={()=> setHover(false)}    
            >
                {articles.map((a, idx)=>
                    <ArticleCard
                        key={`article-${idx}`}
                        href={a.href}
                        label={a.label}
                        note={t(`items.${a.noteKey}`)}
                        img_url={a.img}
                        isSectionHovered={hover}
                    />
                )}
            </div>
        </section>
    )
}
