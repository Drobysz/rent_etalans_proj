"use client";

import { ArticleCard } from "./ArticleCard/ArticleCard";
import s from "./style.module.scss";
import articles from "./articlesData";
import { useState } from "react";

export const Articles = ()=> {
    const [hover, setHover] = useState(false);

    return (
        <section className="flex flex-col gap-4">
            <header>
                <h2 className={s.title}>
                    Local area places
                </h2>
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
                        note={a.note}
                        img_url={a.img}
                        isSectionHovered={hover}
                    />
                )}
            </div>
        </section>
    )
}