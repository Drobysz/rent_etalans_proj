"use client";

import { GlobalContext } from "@/app/[locale]/context/global.context";
import { cn } from "@/lib/utils";
import { useActionState, useContext, useEffect } from "react";
import s from "./style.module.scss";
import { ShoppingBag } from "lucide-react";
import { FormState } from "./formScheme";
import { purchaseAction } from "./action";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const BuyBtn = ({
    isNotEmpty,
}: {
    isNotEmpty: boolean;
})=> {
    const t = useTranslations("basket");
    const tFormErrors = useTranslations("formErrors");
    const { 
        servParams,
        setNotification,
        setServiceBasketErrors
    } = useContext(GlobalContext);
    const router = useRouter();
    
    const [state, action, pending] = 
        useActionState<FormState, FormData>(
            purchaseAction, 
            { errors: {} }
        );
    
    useEffect(() => {
        if (state.success !== undefined) {
            if (state.success) {
                setNotification({
                    status: "success",
                    text: t("invoiceSuccess")
                });

                router.push(state.invoice_url ?? "#");
            } else {
                Object.values(state.errors ?? {}).forEach((v)=> {
                    if (v) {
                        setNotification({
                            status: "error",
                            text: tFormErrors(v)
                        }); 
                    }  
                });

                setServiceBasketErrors(state.errors);

                scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }
    }, [setServiceBasketErrors, setNotification, state.success, state, router, t, tFormErrors]);

    return (
        <form action={action}>
            {Object.entries(servParams).map(([k, v])=> 
                <input
                    key={`field_basket_${k}`} 
                    type="hidden"
                    name={k}
                    value={Array.isArray(v) 
                        ? JSON.stringify(v) 
                        : v ?? ""
                    }
                />
            )}
            <button
                disabled={!isNotEmpty}
                className={cn(
                    s.btn_shop,
                    pending && "bg-green-500",
                    isNotEmpty && !pending ? s.btn_active : s.btn_deactivated
                )}
                type="submit"
            >
                {isNotEmpty
                    ? !pending && <><ShoppingBag />{t("buy")}</> 
                    : t("noItems")
                }
                {pending &&
                    <CircularProgress 
                        className="text-white"
                        color="inherit"
                        size="1rem"
                    />
                }
            </button>
        </form>
    )
}
