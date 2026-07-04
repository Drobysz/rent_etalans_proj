"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { blockDateRange, unblockDateRange, type BlockedDate } from "@/queries/calendar";
import { RangePicker } from "./RangePicker";
import styles from "./style.module.scss";

type CalendarManagerProps = {
  initialBlockedDates: BlockedDate[];
};

function getTodayId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function CalendarManager({ initialBlockedDates }: CalendarManagerProps) {
  const [startDate, setStartDate] = useState(getTodayId());
  const [endDate, setEndDate] = useState(getTodayId());
  const [reason, setReason] = useState("");
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleBlock = async () => {
    if (!startDate || !endDate) {
      setMessage("Sélectionnez une date de début et une date de fin.");
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const blockedDate = await blockDateRange(startDate, endDate, reason.trim() || undefined);
      setBlockedDates((items) => [
        blockedDate,
        ...items.filter((item) => item.id !== blockedDate.id),
      ].sort((left, right) => (
        (left.start_date ?? left.date).localeCompare(right.start_date ?? right.date)
      )));
      setReason("");
      setMessage("Période bloquée.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur inconnue.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnblock = async (blockedDate: BlockedDate) => {
    setIsSaving(true);
    setMessage(null);

    try {
      await unblockDateRange(blockedDate.id);
      setBlockedDates((items) => (
        items.filter((item) => item.id !== blockedDate.id)
      ));
      setMessage("Période débloquée.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur inconnue.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (blockedDate: BlockedDate) => {
    setStartDate((blockedDate.start_date ?? blockedDate.date).slice(0, 10));
    setEndDate((blockedDate.end_date ?? blockedDate.start_date ?? blockedDate.date).slice(0, 10));
    setReason(blockedDate.reason ?? "");
    setMessage("Modifiez la période, puis cliquez sur Bloquer.");
  };

  return (
    <motion.section
      className={styles.page}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <header className={styles.header}>
        <h1>Calendrier</h1>
        <p>Bloquez ou débloquez les dates indisponibles pour les réservations.</p>
      </header>

      <div className={styles.toolbar}>
        <RangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(range) => {
            setStartDate(range.startDate);
            setEndDate(range.endDate ?? range.startDate);
          }}
        />
        <label>
          <span>Note</span>
          <input value={reason} onChange={(event) => setReason(event.target.value)} />
        </label>
        <button type="button" onClick={handleBlock} disabled={isSaving}>
          Bloquer
        </button>
      </div>

      {message ? <p className={styles.message}>{message}</p> : null}

      <ul className={styles.list}>
        {blockedDates.map((blockedDate) => (
          <li key={blockedDate.id}>
            <div>
              <strong>
                {(blockedDate.start_date ?? blockedDate.date).slice(0, 10)}
                {" - "}
                {(blockedDate.end_date ?? blockedDate.start_date ?? blockedDate.date).slice(0, 10)}
              </strong>
              {blockedDate.reason ? <span>{blockedDate.reason}</span> : null}
            </div>
            <div className={styles.actions}>
              <button type="button" onClick={() => handleEdit(blockedDate)} disabled={isSaving}>
                Modifier
              </button>
              <button
                type="button"
                onClick={() => handleUnblock(blockedDate)}
                disabled={isSaving}
              >
                Débloquer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
