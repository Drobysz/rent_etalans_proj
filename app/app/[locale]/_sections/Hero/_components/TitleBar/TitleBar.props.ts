type HeroArticle = { 
    src: string; 
    label: string; 
    href: string 
}

export interface TitleBarProps {
    count: number;
    article: HeroArticle;
    imgId: number;
}