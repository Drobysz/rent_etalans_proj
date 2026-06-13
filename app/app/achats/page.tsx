"use client";

import { useState } from "react";
import {
    SearchBar,
    PurchasesList
} from "./_sections";

export default function AchatsPage() {
    const [searchValue, setSearchValue] = useState("");

    return (
        <div className="pt-10 pb-20 flex flex-col gap-10">
            <div className="flex flex-col gap-2 items-center">
                <h1 className="font-extrabold text-center text-amber-500 text-2xl">
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