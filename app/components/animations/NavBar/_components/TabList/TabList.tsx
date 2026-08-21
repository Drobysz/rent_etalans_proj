"use client"

import { Tab } from "./_components/index";
import { usePathname } from "@/i18n/navigation";
import { TabListProps } from "./TabList.props";
import { useTranslations } from "next-intl";
import { PathService } from "@/helpers/path";
import { TabListType } from "../../types";
import { SplitByRowsText } from "@/components/animations/Texts/SplitByRowsText/SplitByRowsText";

export const TabList = ({
	setPosition,
	setPositionClicked
}: TabListProps)=> {
	const t = useTranslations("navigation");
	const pathname = usePathname();
	const tabsList: TabListType[] = [
        { href: '/', label: t("home") },
        { 
			links: [
				{ href: '/housing/reservation', label: t("reservation") },
				{ href: '/housing/purchases', label: t("purchases") },
				{ href: '/housing/services', label: t("services") }
			],
			label: t("housing")
		},
		{ href: '/documentation', label: t("docs") },
    ];

	return (
		<>
			{tabsList.map(tab=> (
				<Tab
					key={"id_" + tab.label}
					isActive={PathService.getPageActivity(
						pathname, tab.href, tab.links
					)}
					setPosition={setPosition}
					setPositionClicked={setPositionClicked}
					href={tab.href ?? ""}
					list={tab.links ?? []} 
				>
					<SplitByRowsText
						tag="span"
					>
						{tab.label}
					</SplitByRowsText>
				</Tab>
			))}
		</>
	)
}
