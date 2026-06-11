import { AnimatePresence, motion } from "framer-motion"
import cn from "classnames";

export const SMtag = ({title}: {title: string})=> {
	return (
		<AnimatePresence>
			<motion.p
				className={cn(
					"absolute z-10 -top-8 right-[50%] w-fit",
					"rounded-md border border-neutral-400",
					"text-neutral-500 text-xs translate-x-[50%]",
					"p-1 bg-white max-[760px]: text-[0.3rem p-0.5]"
				)}

				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 2 }}
			>
				{title}
			</motion.p>
		</AnimatePresence>
	)
}