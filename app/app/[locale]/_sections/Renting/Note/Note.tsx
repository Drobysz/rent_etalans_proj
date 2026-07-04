import { MoveRight } from "lucide-react";
import s from "../style.module.scss";
import Link from "next/link";
import { PathService } from "@/helpers/path";

export const Note = ()=> {
    return (
        <div className="flex flex-col gap-5">
                <p className={s.note}>
                    We are delighted to welcome you to our home. 
                    We have done our best to make your stay as comfortable as possible. 
                    We also offer additional services that may enhance your stay.
                </p>
                <Link
                    className={s.link}
                    href={PathService.withBasePath("/housing/reservation")}
                >
                    <span>make reservation</span>
                    <div>
                        <MoveRight
                            className="w-4 h-4"
                        />
                    </div>
                </Link>
            </div>
    )
}