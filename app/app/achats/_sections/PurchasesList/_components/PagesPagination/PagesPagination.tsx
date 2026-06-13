"use client";

import { Dispatch, SetStateAction } from "react";
import s from "./style.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cn from "classnames";

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

    console.log(`Page number: ${page_nb}; Current page: ${page}`);

    return (
        <>
            {page && page_nb > 1 && (
                <div className="flex items-center justify-center gap-4">
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
                        {Array(page_nb).fill(true).map((_, i)=> (
                            <li
                                key={`page_setter_${i}`}
                                className={cn(
                                    s.page_sel,
                                    page == i+1
                                        ? s.page_sel_active
                                        : s.page_sel_inactive
                                )}
                                onClick={()=> handleSelectorClick(i+1)}
                            >
                                <span>
                                    {i+1}
                                </span>
                            </li>
                        ))}
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
            )}
        </>
    )
}