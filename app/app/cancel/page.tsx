"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {CancelTitle} from "./_components/CancelTitle";
import cn from "classnames";

export default function FailedPaymentPage () {
    const router = useRouter();

    useEffect(() => {
        const failedTime = setTimeout(() => router.push("/"), 2000);

        return () => clearTimeout(failedTime);
    }, [router]);

    return (
        <main className={cn(
            "h-screen flex",
            "justify-center items-center"
        )}>
            <CancelTitle>
                Payment failed. Redirecting...
            </CancelTitle>
        </main>
    );
};