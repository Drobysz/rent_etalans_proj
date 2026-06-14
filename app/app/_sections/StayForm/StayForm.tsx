"use client";

import { cn } from "@/lib/utils";
import { geist } from "@/fonts/fonts";
import s from "./style.module.scss";
import { StayInput } from "./_components";
import { ServicesOrderParams } from "@/types";
import forms from "./forms";
import { useContext, useEffect, useState } from "react";
import { CursorPosition } from "./types";
import { Cursor } from "./_components/Cursor/Cursor";
import { BubbleText } from "@/components/animations/BubbleText/BubbleText";
import { GlobalContext } from "@/app/context/global.context";

export const StayForm = ()=> {
    const { setMouseText } = useContext(GlobalContext);

    const [currFormId, setCurrFormId] = useState<number | null>(null);
    const [position, setPosition] = useState<CursorPosition>({
        left: 0,
        width: 0,
        top: 0,
        height: 0,
    });

    const isActive = currFormId !== null;
    const MOUSE_GUIDE_TEXT = "Utilisez les flèches (↓) et (↑) pour faire défiler les formulaires";
    const FORM_COUNT = 4;

    useEffect(()=> {
        const handleKeyDown = (e: KeyboardEvent)=> {
            if (currFormId === null) return;

            switch (e.key) {
				case "ArrowDown":
                    setCurrFormId(Math.max(0, currFormId - 1));
					break;

				case "ArrowUp":
                    setCurrFormId(Math.min(FORM_COUNT - 1, currFormId + 1));
					break;
			
				default:
					break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return ()=> document.removeEventListener('keydown', handleKeyDown);
    }, [currFormId, setCurrFormId]);

    return (
        <section className={s.stayform_section}>
            <BubbleText 
                className={cn(
                    geist.className,
                    s.title
                )} 
                text="Saisissez les détails de votre séjour"
            />
            <form 
                className={cn(
                    s.form,
                    isActive ? "bg-neutral-200 border-0" : "shadow-xl"
                )}

                onMouseEnter={()=> setMouseText(MOUSE_GUIDE_TEXT)}
                onMouseLeave={()=> setMouseText("")}
            >
                {forms.map((form, idx)=> 
                    <StayInput 
                        key={`${form.key}-${idx}`}
                        formId={idx}
                        isSectActive={isActive}
                        isFocused={idx == currFormId}
                        currFormId={currFormId}
                        param={form.key as keyof ServicesOrderParams}
                        label={form.label}
                        placeholder={form.placeholder}
                        type={form.type}
                        setPosition={setPosition}
                        setCurrFormId={setCurrFormId}
                    />
                )}
                <Cursor 
                    position={position}
                    isActive={isActive}
                />
            </form>
        </section>
    )
}
