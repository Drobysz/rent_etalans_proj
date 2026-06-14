"use client"

import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import {CancelTitle} from "./_components/CancelTitle";
import cn from "classnames";
import { useTranslations } from "next-intl";

export default function FailedPaymentPage () {
    const t = useTranslations("cancel");
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
                {t("title")}
            </CancelTitle>
        </main>
    );
};
