import { DetailedHTMLProps, LiHTMLAttributes } from "react";

export interface UnderlinedLinkProps extends DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>{
	className?: string;
	href:		string;
	colorLine?: "light" | "dark" | "primary";
}