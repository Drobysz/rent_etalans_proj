"use client";

import { Payment } from "@/types";
import { useEffect, useState } from "react";
import { Loading } from "./loading";
import s from "./style.module.scss";
import { 
    PurchaseArticle,
    PagesPagination
} from "./_components";
import { motion } from "framer-motion";
import { transitionBounce } from "@/framer_templates/transitions";
import { variantsOpacityAppearence } from "@/framer_templates/variants";
import { useTranslations } from "next-intl";
import { TextService } from "@/helpers/string";
import { getAppApiUrl, getBackendApiUrl } from "@/lib/api";

function getPaymentSearchText(payment: Payment) {
    return [
        payment.reservation_code,
        payment.reservation?.reservation_code,
        payment.reserve_id,
        payment.apartment?.name,
        payment.reservation?.apartment?.name,
        payment.email,
    ].filter(Boolean).join(" ");
}

function getPaymentCodes(payment: Payment) {
    return [
        payment.session_id,
        payment.reservation_code,
        payment.reservation?.reservation_code,
        payment.reserve_id,
        payment.id,
    ].filter(Boolean).map(String);
}

function isSamePayment(left: Payment, right: Payment) {
    const leftCodes = getPaymentCodes(left);
    const rightCodes = getPaymentCodes(right);

    return leftCodes.some((code) => rightCodes.includes(code));
}

function mergePaymentLists(currentPayments: Payment[], incomingPayments: Payment[]) {
    return incomingPayments.reduce<Payment[]>((result, payment) => {
        const existingIndex = result.findIndex((storedPayment) => isSamePayment(storedPayment, payment));

        if (existingIndex >= 0) {
            result[existingIndex] = {
                ...result[existingIndex],
                ...payment,
                services: payment.services?.length ? payment.services : result[existingIndex].services,
                reservation: payment.reservation ?? result[existingIndex].reservation,
                apartment: payment.apartment ?? result[existingIndex].apartment,
            };
        } else {
            result.push(payment);
        }

        return result;
    }, [...currentPayments]);
}

export const PurchasesList = ({
    searchValue
}: {
    searchValue: string;
})=> {
    const t = useTranslations("achats");
     const [payments, setPayments] = useState<Payment[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(()=> {
        const fetchStoredPayments = async () => {
            const res = await fetch(getAppApiUrl("/api/cookies/payment-storage"), {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                return [];
            }

            const item = await res.json();

            return (item.payments ?? []) as Payment[];
        };
        const restorePaymentFromSession = async (sessionId: string) => {
            const params = new URLSearchParams({
                session_id: sessionId,
            });

            await fetch(getAppApiUrl(`/api/cookies/payment-storage/session?${params.toString()}`), {
                method: "GET",
                credentials: "include",
            });
        };
        const fetchBackendPayments = async (reserveId: string) => {
            const normalizedReserveId = reserveId.trim();

            if (!normalizedReserveId) {
                return [];
            }

            const params = new URLSearchParams({
                reserve_id: normalizedReserveId,
                sort: "desc",
            });
            const res = await fetch(getBackendApiUrl(`/payments?${params.toString()}`), {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!res.ok) {
                return [];
            }

            const payload = await res.json();

            return (payload?.data ?? []) as Payment[];
        };
        const storePayment = async (payment: Payment) => {
            await fetch(getAppApiUrl("/api/cookies/payment-storage"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payment),
            });
        };
        const loadPayments = async ()=> {
            setIsPending(true);

            let nextPayments = await fetchStoredPayments();
            const sessionId = new URLSearchParams(window.location.search).get("session_id");

            if (nextPayments.length === 0 && sessionId) {
                await restorePaymentFromSession(sessionId);
                nextPayments = await fetchStoredPayments();
            }

            const backendPayments = await fetchBackendPayments(searchValue);

            if (backendPayments.length > 0) {
                for (const payment of backendPayments) {
                    await storePayment(payment);
                }

                nextPayments = mergePaymentLists(nextPayments, backendPayments);
            }

            setPayments(nextPayments);
            setIsPending(false);
        }

        loadPayments();
    }, [searchValue]);

    useEffect(()=> {
        const setDefault = ()=> setCurrentPage(1);
        setDefault();
    }, [searchValue]);

    const ts = TextService;

    const filteredPayments = payments.filter(p =>
        ts.includesNormalized(getPaymentSearchText(p), searchValue)
    );

    const ITEMS_PER_PAGE = 7;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    const pagePayments = filteredPayments.slice(start, end);
    const lastPage = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

    const showEmpty = !isPending && filteredPayments.length === 0;
    const showPagination = !isPending && filteredPayments.length > 0;

    return (
        <div className="flex flex-col gap-3">
            <motion.ul 
                className={s.res_list}

                initial="start"
                animate="end"

                transition={transitionBounce}
                variants={variantsOpacityAppearence}
            >
                {pagePayments.length > 0 && !isPending &&
                    pagePayments.map((p, i)=> 
                        <PurchaseArticle
                            key={`serv_result_${p.id}_${i}`}
                            payment={p}
                        />
                    )
                }
                {isPending && <Loading />}
                {showEmpty &&
                    <h2 className="text-center text-2xl text-gray-400">
                        {t("empty")}
                    </h2>
                }
            </motion.ul>

            {showPagination && 
                <PagesPagination 
                    page={currentPage}
                    setPage={setCurrentPage}
                    page_nb={lastPage}
                />
            }
        </div>
    )
}
