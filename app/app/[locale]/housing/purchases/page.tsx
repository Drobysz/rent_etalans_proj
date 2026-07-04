"use client";

import { useState } from "react";
import {
    SearchBar,
    PurchasesList
} from "./_sections";
import s from "./style.module.scss";
import { useTranslations } from "next-intl";

export default function AchatsPage() {
    const t = useTranslations("achats");
    const [searchValue, setSearchValue] = useState("");

    return (
        <div className={s.page}>
            <div className={s.heading}>
                <h1 className={s.title}>
                    {t("title")}
                </h1>
                <SearchBar 
                    setSearchValue={setSearchValue}
                />
            </div>
            <PurchasesList 
                searchValue={searchValue}
            />
        </div>
    )
}
