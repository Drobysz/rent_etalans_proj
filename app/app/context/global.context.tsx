"use client";

import { createContext, ReactNode, useState } from "react";
import { AppNotification, Coords, GlobalContextInterface } from "./global.interface";
import { ServicesOrderParams } from "@/types";
import { getServices } from "@/queries";
import useSWR from "swr";

export const initialServParams: ServicesOrderParams = {
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
    isServiceLoading: false,
    notification: { status: "none", text: "" },

    setServParams: ()=> {},
    setMouseGuide: ()=> {},
    setMouseText: ()=> {},
    setNotification: () => {}
});


export const GlobalContextProvider = ({
    children
}: {
    children: ReactNode
})=> {
    const {
        data:services,
        isLoading,
        error
    } = useSWR(
        'services',
        getServices
    );

    const [servParams, setServParams] = useState<ServicesOrderParams>(initialServParams);
    const [mouseGuide, setMouseGuide] = useState<Coords | null>(null);
    const [mouseText, setMouseText] = useState("");
    const [notification, setNotification] = useState<AppNotification>({ status: "none", text: "" });

    return (
        <GlobalContext.Provider
            value={{
                servParams,
                mouseGuide,
                mouseText,
                services,
                serviceError: error,
                isServiceLoading: isLoading,
                notification,

                setServParams,
                setMouseGuide,
                setMouseText,
                setNotification
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}