import cn from "classnames";
import styles from "./ul.module.scss";
import { UnderlinedLinkProps } from "./UnderlinedLink.props";
import Link from "next/link";


export const UnderlinedInnerLink = ({
	className,
	href,
	children,
	colorLine = "light",
}: UnderlinedLinkProps)=> {
	return (
		<span>
			<Link
				href={href}
				className={cn(
					className,
					styles.underline_link
				)}
			>
				<span>{children}</span>
				<span className={cn(
					styles.underline, {
						["bg-white"]: colorLine == "light",
						["bg-gray-700"]: colorLine == "dark",
						["bg-blue-500"]: colorLine == "primary"
					}
				)}/>
			</Link>
		</span>
	)
}