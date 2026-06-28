import { Link } from "@/i18n/navigation";
import { useCallback, useEffect, useRef } from "react";
import { Tabprops } from "../../../../NavBar.interface";
import styles from "./Tab.module.scss";
import cn from "classnames";

export const Tab = ({
    children, isActive, href,
    setPosition, setPositionClicked
}: Tabprops)=> {
    const ref = useRef<HTMLSpanElement>(null!);

    const handleInteraction = useCallback(
        (action: "hover" | "click")=> {
            const { offsetLeft: left, offsetWidth: width } = ref.current;
            const pos = { left, width };

            switch (action) {
                case "hover":
                    setPosition(pos);
                    break;
            
                case "click":
                    setPositionClicked(pos);
                    break;
            };
        }, [setPosition, setPositionClicked]
    );

    useEffect(()=> {
        if (isActive){
            handleInteraction("hover");
            handleInteraction("click");
        };
    }, [handleInteraction, isActive]);

    useEffect(()=> {
        if (!isActive) return;

        const handleResize = ()=> {
            handleInteraction("hover");
            handleInteraction("click");
        };

        window.addEventListener("resize", handleResize);

        return ()=> {
            window.removeEventListener("resize", handleResize);
        };
    }, [handleInteraction, isActive]);

    return (
        <Link
            href={href} 
            className="z-20"
        >
            <span 
                className={cn(
                    isActive ? "text-gold" : "text-neutral-500",
                    styles.sm_text,
                )}
                ref={ref}
                onMouseEnter={()=> handleInteraction("hover")}
                onClick={()=> handleInteraction("click")}
            >
                {children}
            </span>
        </Link>
    );
};
