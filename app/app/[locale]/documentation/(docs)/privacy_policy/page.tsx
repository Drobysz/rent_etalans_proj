import { getTranslations } from "next-intl/server";
import s from "./page.module.scss";

type PolicySection = {
    id: string;
    title: string;
    content: string[];
    list?: string[];
    footer?: string;
    contact?: {
        email: string;
    };
};

export default async function PrivacyPolicyPage ({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "privacyPolicy" });
    const sections = t.raw("sections") as PolicySection[];

    return (
        <article className={s.article}>
            <header className={s.header}>
                <h1 className={s.title}>
                    {t("title")}
                </h1>
                <p className={s.updated}>
                    {t("lastUpdatedLabel")}: {t("lastUpdated")}
                </p>
            </header>

            {sections.map((section) => (
                <section
                    key={section.id}
                    className={s.section}
                    id={section.id}
                >
                    <h2 className={s.sectionTitle}>
                        {section.title}
                    </h2>
                    {section.content.map((paragraph) => (
                        <p
                            key={paragraph}
                            className={s.paragraph}
                        >
                            {paragraph}
                        </p>
                    ))}
                    {section.list && (
                        <ul className={s.list}>
                            {section.list.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    )}
                    {section.footer && (
                        <p className={s.paragraph}>
                            {section.footer}
                        </p>
                    )}
                    {section.contact && (
                        <a
                            className={s.contactLink}
                            href={"mailto:alexdrobyszfr@gmail.com"}
                        >
                           alexdrobyszfr@gmail.com
                        </a>
                    )}
                </section>
            ))}
        </article>
    )
}
