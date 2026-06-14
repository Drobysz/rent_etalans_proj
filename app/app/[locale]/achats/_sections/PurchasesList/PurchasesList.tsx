"use client";

import { getServiceResult } from "@/queries/serviceResults";
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

export const PurchasesList = ({
    searchValue
}: {
    searchValue: string;
})=> {;
    const t = useTranslations("achats");
    const [purchases, setPurchases] = useState<Payment[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);

    useEffect(()=> {
        const fetchResult = async ()=> {
            setIsPending(true);

            const res = await getServiceResult(searchValue, currentPage);
            const items = res.data ?? [];

            setPurchases(items);
            setCurrentPage(res.current_page);
            setLastPage(res.last_page);

            setIsPending(false);
        }

        fetchResult();
    }, [searchValue, currentPage]);

    return (
        <div className="flex flex-col gap-3">
            <motion.ul 
                className={s.res_list}

                initial="start"
                animate="end"

                transition={transitionBounce}
                variants={variantsOpacityAppearence}
            >
                {purchases.length > 0 && !isPending &&
                    purchases.map((p, i)=> 
                        <PurchaseArticle
                            key={`serv_result_${p.id}_${i}`}
                            payment={p}
                        />
                    )
                }
                {isPending && <Loading />}
                {purchases.length == 0 &&
                    <h2 className="text-center text-2xl text-gray-400">
                        {t("empty")}
                    </h2>
                }
            </motion.ul>

            <PagesPagination 
                page={currentPage}
                setPage={setCurrentPage}
                page_nb={lastPage}
            />
        </div>
    )
}
