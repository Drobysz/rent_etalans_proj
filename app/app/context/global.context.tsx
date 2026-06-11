"use client";

import { createContext, ReactNode, useState } from "react";
import { Coords, GlobalContextInterface } from "./global.interface";
import { ServicesOrderParams } from "@/types";

const initialServParams: ServicesOrderParams = {
    email: "",
    airbnb_code: "",
    days_count: 0,
    visitors_count: 0,
    services_ids: [],
};

export const GlobalContext = createContext<GlobalContextInterface>({
    servParams: initialServParams,
    mouseGuide: null,
    mouseText: "",

    setServParams: ()=> {},
    setMouseGuide: ()=> {},
    setMouseText: ()=> {},
});


export const GlobalContextProvider = ({
    children
}: {
    children: ReactNode
})=> {
    const [servParams, setServParams] = useState<ServicesOrderParams>(initialServParams);
    const [mouseGuide, setMouseGuide] = useState<Coords | null>(null);
    const [mouseText, setMouseText] = useState("");

    return (
        <GlobalContext.Provider
            value={{
                servParams,
                mouseGuide,
                mouseText,

                setServParams,
                setMouseGuide,
                setMouseText
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}