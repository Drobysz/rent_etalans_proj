import { Link } from "@/i18n/navigation";
import { TitleBarProps } from "./TitleBar.props"
import s from './style.module.scss';
import { cn } from "@/lib/utils";
import { bilbo_swash_caps } from "@/fonts/fonts";

export const TitleBar = ({
    count,
    article,
    imgId
}: TitleBarProps)=> {

    return (
        <article className={s.bar_body}>
            <ul className={cn(
                s.bar_progress_lines,
            )}>
                {Array.from({ length: count }).map((_, index) => (
                    <li 
                        key={`bar_item_${index}`}
                        className={cn(
                            s.progress_line,
                        )}
                    >
                        <hr 
                            className={cn(
                                s.progress,
                                index === imgId && s.progress_line_run
                            )}
                        />
                    </li>
                ))}
            </ul>
            <div className={s.inner_content}>
                <h2 className={cn(
                    "text-5xl max-[768px]:text-2xl",
                    bilbo_swash_caps.className,
                )}>
                    {article.label}
                </h2>

                <Link
                    target="_blank"
                    href={article.href}
                    className={s.link}
                >
                    VIEW
                </Link>
            </div>
        </article>
    )
}