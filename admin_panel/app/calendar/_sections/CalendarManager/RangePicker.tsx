"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import styles from "./style.module.scss";

type RangePickerProps = {
  startDate: string | null;
  endDate: string | null;
  onChange: (range: { startDate: string; endDate: string | null }) => void;
};

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

export function RangePicker({ startDate, endDate, onChange }: RangePickerProps) {
  const [open, setOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(() => {
    const baseDate = startDate ? fromDateId(startDate) : new Date();
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  });
  const days = useMemo(() => getMonthDays(monthDate), [monthDate]);
  const label = startDate
    ? `${startDate}${endDate ? ` - ${endDate}` : ""}`
    : "Sélectionner une période";
  const monthLabel = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(monthDate);

  const selectDate = (date: Date) => {
    const dateId = toDateId(date);

    if (!startDate || endDate || dateId < startDate) {
      onChange({ startDate: dateId, endDate: null });
      return;
    }

    onChange({ startDate, endDate: dateId });
    window.setTimeout(() => setOpen(false), 160);
  };

  const moveMonth = (direction: -1 | 1) => {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  return (
    <div className={styles.rangePicker}>
      <button type="button" className={styles.rangeTrigger} onClick={() => setOpen((current) => !current)}>
        <span>Période</span>
        <strong>{label}</strong>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.calendar}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.calendarHeader}>
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Mois précédent">
                ‹
              </button>
              <strong>{monthLabel}</strong>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Mois suivant">
                ›
              </button>
            </div>
            <div className={styles.weekdays}>
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className={styles.daysGrid}>
              {days.map((date, index) => {
                if (!date) {
                  return <span key={`empty-${index}`} />;
                }

                const dateId = toDateId(date);
                const isStart = dateId === startDate;
                const isEnd = dateId === endDate;
                const isInRange = Boolean(startDate && endDate && dateId > startDate && dateId < endDate);

                return (
                  <button
                    key={dateId}
                    type="button"
                    className={[
                      styles.day,
                      isInRange ? styles.dayInRange : "",
                      isStart || isEnd ? styles.daySelected : "",
                    ].join(" ")}
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
    </div>
  );
}
