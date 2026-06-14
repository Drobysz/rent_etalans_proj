"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Search } from "lucide-react";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const SearchBar = ({
    setSearchValue
}: {
    setSearchValue: Dispatch<SetStateAction<string>>;
})=> {
    const t = useTranslations("achats");
    const [debounceSearchValue, setDebounceSearchValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    useEffect(()=> {
        const timeOut = setTimeout(() => {
            setSearchValue(debounceSearchValue);
        }, 400);

        return ()=> clearTimeout(timeOut);
    }, [debounceSearchValue, setSearchValue]);

    return (
        <div className="flex justify-center">
            <div className="relative">
                <input
                    className={s.searchbar}
                    onChange={e=> setDebounceSearchValue(e.target.value)}
                    type="search"
                    placeholder={t("searchPlaceholder")}
                    onFocus={()=> setIsFocused(true)}
                    onBlur={()=> setIsFocused(false)}
                />
                <Search 
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 left-3",
                        isFocused ? "text-gray-600" : "text-gray-400"
                    )}
                />
            </div>
        </div>
    )
}
