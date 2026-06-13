import cn from "classnames";
import { ReactNode } from "react";
import { CircularProgress } from "@mui/material";
import s from "./style.module.scss";

export const CancelTitle = ({children}: {children: ReactNode})=> {
	return (
		<section className={s.section}>
			<h1 className={s.title}>
				{children}
			</h1>
			<CircularProgress 
				color="inherit"
				size="3rem"
			/>
		</section>
	)
}