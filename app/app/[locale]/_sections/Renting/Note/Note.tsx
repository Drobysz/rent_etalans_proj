import { MoveRight } from "lucide-react";
import s from "../style.module.scss";
import Link from "next/link";
import { PathService } from "@/helpers/path";
import { useTranslations } from "next-intl";
import { SplitByRowsText } from "@/components/animations/Texts/SplitByRowsText/SplitByRowsText";
import { ViewReveal } from "@/components/animations/ViewReveal/ViewReveal";

export const Note = ()=> {
    const t = useTranslations("home.renting");

    return (
        <div className="flex flex-col gap-5">
                <SplitByRowsText 
                    className={s.note}
                    tag="p"
                >
                    {t("note")}
                </SplitByRowsText>
                <ViewReveal>
                    <Link
                        className={s.link}
                        href={PathService.withBasePath("/housing/reservation")}
                    >
                        <span>{t("reservationLink")}</span>
                        <div>
                            <MoveRight
                                className="w-4 h-4"
                            />
                        </div>
                    </Link>
                </ViewReveal>
            </div>
    )
}
