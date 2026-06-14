import { trade_winds, bagel } from "@/fonts/fonts";
import s from "./style.module.scss";
import { UnderlinedInnerLink } from "@/components/animations/UnderlinedLink/UnderlinedInnerLink"
import cn from "classnames";
import { useTranslations } from "next-intl";

export const DevTitle = ({
    className
}: {
    className?: string
})=> {
    const t = useTranslations("footer");

    return (
        <p className={cn(
            className,
            s.dev_title,
            bagel.className
        )}>
                {t("developedBy")}
                <UnderlinedInnerLink
                    href="https://drobysz.vercel.app/fr"
                    colorLine="primary"
                >
                    <span className={cn(
                        trade_winds.className,
                        "text-blue-400"
                    )}>
                        Drobysz
                    </span>
                </UnderlinedInnerLink>
            </p>
    )
}
