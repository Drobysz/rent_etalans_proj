import { useRef, useState } from "react";
import { SMobj } from "./SMBlock.props";
import { useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { SMtag, SMicon, SMbody } from "./_components";
import { useWindowWidth } from "@/hooks/index";

export const SMBlock = ({
    title,
    link,
    img,
    mouseX
}: SMobj)=> {
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    const width = useWindowWidth();

    const distance = useTransform(mouseX, (horizontalCoordindate)=> {
        const border = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

        return horizontalCoordindate - (border!.x + border!.width/2);
    });


    const ranges = width > 760
        ? { mouse: [-100, 0, 100], size: [40, 60, 40] }
        : { mouse: [-100, 0, 100], size: [35, 50, 35] }

    const blockTransform = useTransform(
        distance,
        ranges.mouse,
        ranges.size
    );

    const iconTransform = useTransform(
        distance,
        ranges.mouse,
        ranges.size
    );

    const transition = {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    };

    const blockSize = useSpring(blockTransform, transition);
    const iconSize = useSpring(iconTransform, transition);

    return (
        <Link
            href={link}
            target="_blank"
        >
            <SMbody
                ref={ref}
                blockSize={blockSize}
                setHovered={setHovered}
            >
                {hovered && <SMtag title={title}/>}
                <SMicon
                    img={img}
                    iconSize={iconSize}
                />
            </SMbody>
        </Link>  
    );
};