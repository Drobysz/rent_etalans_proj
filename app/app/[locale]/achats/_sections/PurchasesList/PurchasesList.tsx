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
})=> {
    const t = useTranslations("achats");
    const [purchases, setPurchases] = useState<Payment[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);

    useEffect(()=> {
        setCurrentPage(1);
    }, [searchValue]);

    useEffect(()=> {
        let ignore = false;

        const fetchResult = async ()=> {
            setIsPending(true);
            setHasLoaded(false);

            try {
                const res = await getServiceResult(searchValue, currentPage);
                const items = res.data ?? [];

                if (!ignore) {
                    setPurchases(items);
                    setCurrentPage(res.current_page);
                    setLastPage(res.last_page);
                }
            } catch (error) {
                console.error(error);

                if (!ignore) {
                    setPurchases([]);
                    setLastPage(0);
                }
            } finally {
                if (!ignore) {
                    setIsPending(false);
                    setHasLoaded(true);
                }
            }
        }

        fetchResult();

        return ()=> {
            ignore = true;
        };
    }, [searchValue, currentPage]);

    const showEmpty = hasLoaded && !isPending && purchases.length === 0;
    const showPagination = hasLoaded && !isPending && purchases.length > 0;

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
