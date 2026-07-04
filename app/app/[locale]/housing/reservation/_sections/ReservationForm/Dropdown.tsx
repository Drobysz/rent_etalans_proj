"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import s from "./style.module.scss";

export type DropdownOption = {
    value: string;
    label: string;
};

type DropdownProps = {
    label: string;
    value: string;
    options: DropdownOption[];
    onChange: (value: string) => void;
};

export const Dropdown = ({
    label,
    value,
    options,
    onChange,
}: DropdownProps) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const selected = options.find((option) => option.value === value) ?? options[0];

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", closeOnOutsideClick);

        return () => document.removeEventListener("mousedown", closeOnOutsideClick);
    }, []);

    const selectOption = (nextValue: string) => {
        onChange(nextValue);
        setOpen(false);
    };

    return (
        <div className={s.dropdown} ref={rootRef}>
            <button
                className={cn(s.field, s.dropdown_trigger)}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        setOpen(false);
                    }
                }}
            >
                <span>{label}</span>
                <strong>{selected?.label}</strong>
                <ChevronDown className={cn(s.dropdown_chevron, open && s.dropdown_chevron_open)} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        className={s.dropdown_menu}
                        role="listbox"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {options.map((option) => {
                            const active = option.value === selected?.value;

                            return (
                                <li key={option.value} role="option" aria-selected={active}>
                                    <button
                                        type="button"
                                        className={cn(s.dropdown_option, active && s.dropdown_option_active)}
                                        onClick={() => selectOption(option.value)}
                                    >
                                        {active ? <Check /> : <span />}
                                        {option.label}
                                    </button>
                                </li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};
