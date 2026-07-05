"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useReservation } from "../../context/reservation.context";
import s from "./style.module.scss";

type DatePickerProps = {
    open: boolean;
    disabledDates: string[];
    triggerRef: RefObject<HTMLElement | null>;
    onClose: () => void;
};

const DAY_MS = 86_400_000;

function toDateId(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function fromDateId(date: string) {
    return new Date(`${date}T00:00:00`);
}

function getMonthDays(monthDate: Date) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const leadingDays = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
        ...Array.from({ length: leadingDays }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ];
}

function rangeContainsDisabled(start: string, end: string, disabledDates: Set<string>) {
    let date = new Date(fromDateId(start).getTime() + DAY_MS);
    const checkout = fromDateId(end);

    while (date < checkout) {
        if (disabledDates.has(toDateId(date))) {
            return true;
        }

        date = new Date(date.getTime() + DAY_MS);
    }

    return false;
}

export const DatePicker = ({
    open,
    disabledDates,
    triggerRef,
    onClose,
}: DatePickerProps) => {
    const t = useTranslations("reservation.calendar");
    const {
        checkin,
        checkout,
        setCheckin,
        setCheckout,
    } = useReservation();
    const [monthDate, setMonthDate] = useState(() => {
        const baseDate = checkin ? fromDateId(checkin) : new Date();
        return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    });
    const calendarRef = useRef<HTMLDivElement | null>(null);

    const disabledSet = useMemo(() => new Set(disabledDates), [disabledDates]);
    const today = toDateId(new Date());
    const days = getMonthDays(monthDate);
    const monthLabel = new Intl.DateTimeFormat(undefined, {
        month: "long",
        year: "numeric",
    }).format(monthDate);

    const selectDate = (date: Date) => {
        const dateId = toDateId(date);
        const isDisabled = dateId < today || disabledSet.has(dateId);

        if (isDisabled) return;

        if (!checkin || checkout || dateId <= checkin) {
            setCheckin(dateId);
            setCheckout(null);
            return;
        }

        if (rangeContainsDisabled(checkin, dateId, disabledSet)) {
            return;
        }

        setCheckout(dateId);
        window.setTimeout(onClose, 180);
    };

    const moveMonth = (direction: -1 | 1) => {
        setMonthDate((current) => (
            new Date(current.getFullYear(), current.getMonth() + direction, 1)
        ));
    };

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;

            if (calendarRef.current?.contains(target)) return;
            if (triggerRef.current?.contains(target)) return;

            onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [onClose, open, triggerRef]);

    return (
        <AnimatePresence initial={false}>
            {open && (
                <motion.div
                    ref={calendarRef}
                    className={s.calendar}
                    initial={{ opacity: 0, x: "-50%", y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: "-50%", y: 10, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className={s.calendar_header}>
                        <button type="button" onClick={() => moveMonth(-1)} aria-label={t("previousMonth")}>
                            <ChevronLeft />
                        </button>
                        <strong>{monthLabel}</strong>
                        <button type="button" onClick={() => moveMonth(1)} aria-label={t("nextMonth")}>
                            <ChevronRight />
                        </button>
                    </div>
                    <div className={s.weekdays}>
                        {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                            <span key={day}>{t(`weekdays.${day}`)}</span>
                        ))}
                    </div>
                    <div className={s.days_grid}>
                        {days.map((date, index) => {
                            if (!date) {
                                return <span key={`empty-${index}`} />;
                            }

                            const dateId = toDateId(date);
                            const isDisabled = dateId < today || disabledSet.has(dateId);
                            const isStart = dateId === checkin;
                            const isEnd = dateId === checkout;
                            const isInRange = Boolean(
                                checkin && checkout && dateId > checkin && dateId < checkout
                            );

                            return (
                                <button
                                    key={dateId}
                                    type="button"
                                    disabled={isDisabled}
                                    className={cn(
                                        s.day,
                                        isDisabled && s.day_disabled,
                                        isInRange && s.day_in_range,
                                        (isStart || isEnd) && s.day_selected,
                                    )}
                                    onClick={() => selectDate(date)}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
