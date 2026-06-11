"use client";

import { GlobalContext } from "@/app/context/global.context";
import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { StayInputProps } from "./StayInput.props";
import s from "./style.module.scss";
import { cn } from "@/lib/utils";

export const StayInput = ({
    label,
    isFocused,
    isSectActive,
    currFormId,
    setCurrFormId,
    formId,
    param,
    setPosition,
    className,
    ...props
}: StayInputProps)=> {
    const { setServParams } = useContext(GlobalContext);
    const [hover, setHover] = useState(false);
    const ref = useRef<HTMLLabelElement>(null!);
    const inputRef = useRef<HTMLInputElement>(null!);

    const inputId = `${label}-${param}`;

    const isInputFocused = isSectActive && isFocused
    const isHoveredAndNotActive = !isSectActive && hover

    const isHighlighted = isHoveredAndNotActive || isInputFocused;    

    const handleChange = (e: ChangeEvent<HTMLInputElement>)=> {
        const value = e.target.value;

        setServParams(prev => ({
            ...prev,
            [param]: value
        }));
    };

    useEffect(()=> {
        const handleFormPosChange = ()=> {
            const { offsetLeft: left, offsetWidth: width } = ref.current;
            const pos = { left, width };

            setPosition(pos);
        }

        if (formId === currFormId) {
            handleFormPosChange();
            inputRef.current.focus();
        }
    }, [currFormId, formId, setPosition])

    useEffect(()=> {
        const handleInputBlur = (e: KeyboardEvent)=> {
            if (e.key == "Escape" && formId === currFormId) {
                inputRef.current.blur();
            }
        }

        document.addEventListener('keydown', handleInputBlur);
        return ()=> document.removeEventListener('keydown', handleInputBlur);
    }, [currFormId, formId])

    return (
        <label 
            ref={ref}
            htmlFor={inputId}
            onMouseEnter={()=> setHover(true)}
            onMouseLeave={()=> setHover(false)}
            className={cn(
                s.space,
                isSectActive && s.sect_active,
                isSectActive && !isFocused && "blur-[0.1rem]"
            )}
        >
            <div className={s.body}>
                <span className={cn(
                    s.label,
                    isFocused && s.light
                )}>
                    {label}
                </span>
                <div className={s.input_space}>
                    <input
                        {...props}
                        ref={inputRef}
                        className={cn(
                            className,
                            s.input,
                            isFocused && "not-italic", 
                        )}
                        id={inputId}
                        type="text"
                        onChange={handleChange}
                        onFocus={()=> setCurrFormId(formId)}
                        onBlur={()=> setCurrFormId(null)}
                    />
                    <span 
                        className={cn(
                            s.underline,
                            isHighlighted ? s.underline_load : s.underline_load_back, {
                                ["bg-neutral-500"]: isHoveredAndNotActive,
                                ["bg-amber-400"]: isInputFocused
                            }
                        )}
                    />
                </div>
            </div>
        </label>
    )
}