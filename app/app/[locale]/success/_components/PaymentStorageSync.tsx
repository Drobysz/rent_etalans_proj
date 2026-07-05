"use client";

import { useEffect } from "react";
import { Payment } from "@/types";
import { getAppApiUrl } from "@/lib/api";

type PaymentStorageSyncProps = {
    payment: Payment;
};

export const PaymentStorageSync = ({
    payment,
}: PaymentStorageSyncProps) => {
    useEffect(() => {
        fetch(getAppApiUrl("/api/cookies/payment-storage"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payment),
            keepalive: true,
        }).catch((error) => {
            console.error(error);
        });
    }, [payment]);

    return null;
};
