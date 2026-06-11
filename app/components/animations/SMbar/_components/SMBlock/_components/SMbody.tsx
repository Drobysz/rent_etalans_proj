import { MotionValue, motion } from "framer-motion";
import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import cn from "classnames";

export const SMbody = ({
	children,
	blockSize,
	ref,
	setHovered
}:{
	children: ReactNode,
	blockSize: MotionValue<number>,
	ref: RefObject<HTMLDivElement | null> | undefined
	setHovered: Dispatch<SetStateAction<boolean>>
})=> {
	return (
		<motion.div 
			className={cn(
				"relative flex rounded-full",
				"items-center justify-cente",
				"bg-white text-neutral-500"
			)}
			ref={ref}

			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}

			style={{
				width: blockSize,
				height: blockSize
			}}

			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 2 }}
		>
			{children}
		</motion.div>
	)
}