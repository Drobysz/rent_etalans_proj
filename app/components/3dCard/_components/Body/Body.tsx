"use client";

import { cn } from "@/lib/utils"
import { BodyProps } from "./Body.props"
import s from "./../../style.module.scss";
import { 
  CardBody as Card3dBody, 
  DefaultItem
} from "@/components/ui/3d-card";

export const Body = ({
    is3dCard,
    isChosen,
    btnAction,
    children,
    className,
}: BodyProps)=> {
    const Body = is3dCard ? Card3dBody : DefaultItem;

    return (
        <Body 
            className={cn(
            s.body,
            className,
            "group/card", {
                [s.body_chosen]: isChosen,
                ["active:scale-97"]: is3dCard
            }
            )}
        // onClick={is3dCard ? btnAction : ()=> {}}
      >
        {children}
      </Body>
    )
}