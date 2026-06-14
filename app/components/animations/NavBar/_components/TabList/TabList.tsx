"use client"

import { Tab } from "./_components/index";
import { usePathname } from "@/i18n/navigation";
import { TabListProps } from "./TabList.props";
import { useTranslations } from "next-intl";

export const TabList = ({
	setPosition,
	setPositionClicked
}: TabListProps)=> {
	const t = useTranslations("navigation");
	const pathname = usePathname();
	const tabsList = [
        { href: '/', label: t("services") },
        { href: '/achats', label: t("purchases") },
    ];

	return (
		<>
			{ tabsList.map(tab=> (
				<Tab
					key={"id_" + tab.label}
					isActive={pathname === tab.href}
					setPosition={setPosition}
					setPositionClicked={setPositionClicked}
					href={tab.href}
				>
					{tab.label}
				</Tab>
			))}
		</>
	)
}
