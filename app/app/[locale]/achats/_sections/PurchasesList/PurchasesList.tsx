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
        const loadPayments = async ()=> {
            setIsPending(true);

            const res = await fetch(process.env.NEXT_PUBLIC_BASE_PATH + "/api/cookies/payment-storage", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                setPayments([]);
                setIsPending(false);
                return
            }

            const item = await res.json();

            setPayments(item.payments);
            setIsPending(false);
        }

        loadPayments();
    }, []);

    useEffect(()=> {
        const setDefault = ()=> setCurrentPage(1);
        setDefault();
    }, [searchValue]);

    const ts = TextService;

    console.log(payments)

    const filteredPayments = payments.filter(p => 
        ts.includesNormalized(p.reserve_id ?? "", searchValue)
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
