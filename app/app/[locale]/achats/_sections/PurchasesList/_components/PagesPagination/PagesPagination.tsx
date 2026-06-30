"use client";

import { Dispatch, SetStateAction } from "react";
import s from "./style.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cn from "classnames";
import { getPageItems } from "@/helpers";
import { useWindowWidth } from "@/hooks";

type PageItem = number | "start-ellipsis" | "end-ellipsis";

export const PagesPagination = ({
    page, page_nb, setPage
}: {
    page_nb: number;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
})=> {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    const isLimitLong = useWindowWidth(560) as boolean;

    const pageItems: PageItem[] = getPageItems(
        page, page_nb, isLimitLong
    );

    const handleSwitcherClick = (switcher: "left" | "right")=> {
        switch (switcher) {
            case "left":
                if (page - 1 > 0) {
                    setPage(page - 1);
                    scrollToTop();
                }
                break;

            case "right":
                if (page + 1 <= page_nb) {
                    setPage(page + 1);  
                    scrollToTop(); 
                }
                break;
        
            default:
                break;
        }
    }

    const handleSelectorClick = (page: number)=> {
        setPage(page);
        scrollToTop();
    }

    return (
        <>
            {page && page_nb > 1 && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-4 max-[560px]:gap-1.5">
                        <button 
                            className={cn(
                                s.switcher,
                                page > 1 
                                    ? s.switcher_active 
                                    : s.switcher_inactive
                            )}
                            onClick={()=> handleSwitcherClick("left")}
                        >
                            <ChevronLeft
                                width={25}
                                height={25}
                            />
                        </button>
                        <ul className="flex gap-2">
                            {pageItems.map((pi)=> {
                                if (typeof pi !== "number") {
                                    return (
                                        <span className={s.ellipsis} key={pi}>
                                            …
                                        </span>
                                    )
                                }

                                return(
                                <li
                                    key={`page_setter_${pi}`}
                                    className={cn(
                                        s.page_sel,
                                        page === pi
                                            ? s.page_sel_active
                                            : s.page_sel_inactive
                                    )}
                                    onClick={()=> handleSelectorClick(pi)}
                                >
                                    <span>
                                        {pi}
                                    </span>
                                </li>
                            )})}
                        </ul>
                        <button 
                            className={cn(s.switcher,
                                page < page_nb 
                                    ? s.switcher_active 
                                    : s.switcher_inactive
                            )}
                            onClick={()=> handleSwitcherClick("right")}
                        >
                            <ChevronRight
                                width={25}
                                height={25}
                            />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
