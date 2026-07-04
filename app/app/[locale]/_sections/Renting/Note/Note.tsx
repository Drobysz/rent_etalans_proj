import { MoveRight } from "lucide-react";
import s from "../style.module.scss";
import Link from "next/link";
import { PathService } from "@/helpers/path";
import { useTranslations } from "next-intl";

export const Note = ()=> {
    const t = useTranslations("home.renting");

    return (
        <div className="flex flex-col gap-5">
                <p className={s.note}>
                    {t("note")}
                </p>
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
            </div>
    )
}
