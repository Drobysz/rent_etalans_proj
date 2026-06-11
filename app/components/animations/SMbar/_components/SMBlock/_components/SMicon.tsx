import { motion, MotionValue } from "framer-motion";

export const SMicon = ({
	img,
	iconSize
}:{
	img: string,
	iconSize: MotionValue<number>
})=> {
	return (
		<motion.img
			className="p-2"
			src={img}
			style={{ 
				width: iconSize,
				height: iconSize 
			}}
			alt="social media"
		/>
	)
}