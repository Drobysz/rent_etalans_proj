"use client";

import { useEffect } from "react";
import { Payment } from "@/types";

type PaymentStorageSyncProps = {
    payment: Payment;
};

export const PaymentStorageSync = ({
    payment,
}: PaymentStorageSyncProps) => {
    useEffect(() => {
        const controller = new AbortController();

        fetch(process.env.NEXT_PUBLIC_BASE_PATH + "/api/cookies/payment-storage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payment),
            signal: controller.signal,
        }).catch((error) => {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }

            console.error(error);
        });

        return () => controller.abort();
    }, [payment]);

    return null;
};
