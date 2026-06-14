"use client";

import { useState } from "react";
import {
    SearchBar,
    PurchasesList
} from "./_sections";
import s from "./style.module.scss";

export default function AchatsPage() {
    const [searchValue, setSearchValue] = useState("");

    return (
        <div className={s.page}>
            <div className={s.heading}>
                <h1 className={s.title}>
                    Retrouvez vos achats de services
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
