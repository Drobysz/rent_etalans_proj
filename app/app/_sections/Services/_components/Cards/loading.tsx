"use client";

import { useWindowWidth } from "@/hooks";
import { Skeleton } from "@mui/material";

export const Loading = ()=> {
    const width = useWindowWidth();
    const count = width > 450 ? 6 : 3;

    return (
        <>
            {Array(count).fill(true).map((_, i)=>
                <div 
                    key={`serv_card_${i}`}
                    className="flex flex-col gap-2 place-self-center"
                >
                    <Skeleton 
                        className="rounded-lg w-80 shrink-0"
                        animation="wave"
                        height={180}
                        variant="rectangular"
                    />

                    <div className="flex flex-col gap-1">
                        <Skeleton 
                            className="rounded-full w-[65%]"
                            animation="wave"
                        />
                        <Skeleton 
                            className="rounded-full w-[50%]"
                            animation="wave"
                        />
                         <Skeleton 
                            className="rounded-full w-[50%]"
                            animation="wave"
                        />
                    </div>
                </div>
            )}
        </>
    )
}