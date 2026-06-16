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
import { GlobalContext } from "@/app/[locale]/context/global.context";
import { useTranslations } from "next-intl";
import { useWindowWidth } from "@/hooks";

export const StayForm = ()=> {
    const tHome = useTranslations("home");
    const t = useTranslations("stayForm");
    const tFormErrors = useTranslations("formErrors");
    const { serviceBasketErrors, setMouseText } = useContext(GlobalContext);
    const isMousGuideVisible = useWindowWidth(768);

    const [currFormId, setCurrFormId] = useState<number | null>(null);
    const [position, setPosition] = useState<CursorPosition>({
        left: 0,
        width: 0,
        top: 0,
        height: 0,
    });

    const isActive = currFormId !== null;
    const MOUSE_GUIDE_TEXT = t("mouseGuide");
    const FORM_COUNT = 4;

    const handleMouseEnter = ()=> {
        if (isMousGuideVisible) {
            setMouseText(MOUSE_GUIDE_TEXT);
        }
    };

    const handleMouseLeave = ()=> {
        if (isMousGuideVisible) {
            setMouseText("");
        }
    };

    useEffect(()=> {
        const handleKeyDown = (e: KeyboardEvent)=> {
            if (currFormId === null) return;

            switch (e.key) {
				case "ArrowUp":
                    setCurrFormId(Math.max(0, currFormId - 1));
					break;

				case "ArrowDown":
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
                text={tHome("stayFormTitle")}
            />
            <form 
                className={cn(
                    s.form,
                    isActive ? "bg-neutral-200 border-0" : "shadow-xl"
                )}

                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {forms.map((form, idx)=> 
                    <StayInput 
                        key={`${form.key}-${idx}`}
                        formId={idx}
                        isSectActive={isActive}
                        isFocused={idx == currFormId}
                        currFormId={currFormId}
                        param={form.key as keyof ServicesOrderParams}
                        label={t(form.labelKey)}
                        placeholder={t(form.placeholderKey)}
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
            {serviceBasketErrors &&
                <ul className={s.error_list}>
                    {Object.entries(serviceBasketErrors).map(([k, v], i)=> 
                        <li 
                            key={`error-note-${k}-${i}`}
                        >
                            {`${i + 1}) ${tFormErrors(v)};`}
                        </li>
                    )}
                </ul>
            }
        </section>
    )
}
