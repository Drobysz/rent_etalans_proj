import { Service, ServicesOrderParams } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { FormError } from "../layout/Basket/_components/BuyBtn/formScheme";

export type NotificationStatus = "error" | "alert" | "success" | "none";

export interface AppNotification {
    status: NotificationStatus;
    text: string;
}

export interface Coords {
    x: number;
    y: number;
}

export interface GlobalContextInterface {
    servParams: ServicesOrderParams;
    mouseGuide: Coords | null;
    mouseText: string;
    services?: Service[];
    serviceError?: Error;
    isServiceLoading: boolean;
    notification: AppNotification;
    serviceBasketErrors?: FormError;

    setServParams: Dispatch<SetStateAction<ServicesOrderParams>>;
    setMouseGuide: Dispatch<SetStateAction<Coords | null>>;
    setMouseText: Dispatch<SetStateAction<string>>;
    setNotification: Dispatch<SetStateAction<AppNotification>>;
    setServiceBasketErrors: Dispatch<SetStateAction<FormError | undefined>>;
}