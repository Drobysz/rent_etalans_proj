'use client'

import { CursorPosition } from "./types";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import cn from "classnames";
import { TabList, Cursor } from "./_components";

type NavbarType = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

export const Navbar = ({className}: NavbarType)=>{

    // Position when tab is being hovered
    const [position, setPosition] = useState<CursorPosition>({
        left: 0,
        width: 0,
    });

    // Position when tab was clicked
    const [positionClicked, setPositionClicked] = useState<CursorPosition>({
        left: 0,
        width: 0,
    });

    return (
        <nav 
            className={cn(
                "h-full relative flex",
                "gap-4 items-center",
                "max-[560px]:gap-1",
                className
            )}
            onMouseLeave={()=> setPosition(positionClicked)}
        >
            <TabList 
                setPosition={setPosition}
                setPositionClicked={setPositionClicked}
            />
            <Cursor position={position}/>
        </nav>
    );
};
