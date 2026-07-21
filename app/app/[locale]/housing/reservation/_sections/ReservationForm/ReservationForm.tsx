"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { SyntheticEvent } from "react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Apartment } from "@/types";
import { getApartments } from "@/queries/apartments";
import { createInvoice } from "@/queries/createInvoice";
import { getReservationAvailability } from "@/queries/reservationAvailability";
import { cn } from "@/lib/utils";
import { GlobalContext } from "@/app/[locale]/context/global.context";
import { useReservation } from "../../context/reservation.context";
import { DatePicker } from "./DatePicker";
import { Dropdown, type DropdownOption } from "./Dropdown";
import s from "./style.module.scss";

const defaultApartments: Apartment[] = [
    {
        id: 0,
        name: "Apartment 1 - one room",
        price: 45,
        description: "",
        nb_chambers: 1,
        nb_beds: 1,
        apart_link: "/housing/reservation",
    },
    {
        id: -1,
        name: "Apartment 2 - two rooms",
        price: 90,
        description: "",
        nb_chambers: 2,
        nb_beds: 2,
        apart_link: "/housing/reservation",
    },
];

const formatDisplayDate = (date: string | null, fallback: string) => {
    if (!date) return fallback;

    return new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "short",
    }).format(new Date(`${date}T00:00:00`));
};

const createReserveId = () => `RSV-${Date.now().toString(36).toUpperCase()}`;

const compactReservationQuery = "(max-width: 859px)";

function getIsCompactReservation() {
    return typeof window !== "undefined" && window.matchMedia(compactReservationQuery).matches;
}

export const ReservationForm = () => {
    const t = useTranslations("reservation.form");
    const { setNotification } = useContext(GlobalContext);
    const {
        email,
        checkin,
        checkout,
        apartmentId,
        roomsCount,
        guests,
        daysCount,
        setEmail,
        setApartment,
        setGuests,
    } = useReservation();
    const [apartments, setApartments] = useState<Apartment[]>(defaultApartments);
    const [disabledDates, setDisabledDates] = useState<string[]>([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAtPageBottom, setIsAtPageBottom] = useState(false);
    const [isCompact, setIsCompact] = useState(getIsCompactReservation);
    const [guestsInput, setGuestsInput] = useState(String(guests));
    const dateFieldRef = useRef<HTMLButtonElement | null>(null);
    const showFields = !isCompact || isExpanded;

    useEffect(() => {
        getApartments()
            .then((items) => {
                if (items.length > 0) {
                    setApartments(items);
                }
            })
            .catch(() => setApartments(defaultApartments));
    }, []);

    useEffect(() => {
        const selectedApartment = apartments.find((apartment) => apartment.nb_chambers === roomsCount);

        if (selectedApartment && selectedApartment.id > 0 && apartmentId !== selectedApartment.id) {
            setApartment(
                selectedApartment.id,
                selectedApartment.nb_chambers === 2 ? 2 : 1,
            );
        }
    }, [apartmentId, apartments, roomsCount, setApartment]);

    useEffect(() => {
        getReservationAvailability(apartmentId && apartmentId > 0 ? apartmentId : undefined)
            .then((availability) => setDisabledDates(availability.disabled_dates))
            .catch(() => setDisabledDates([]));
    }, [apartmentId]);

    useEffect(() => {
        const updateBottomState = () => {
            const remainingScroll = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
            setIsAtPageBottom(remainingScroll < 180);
        };

        updateBottomState();
        window.addEventListener("scroll", updateBottomState, { passive: true });
        window.addEventListener("resize", updateBottomState);

        return () => {
            window.removeEventListener("scroll", updateBottomState);
            window.removeEventListener("resize", updateBottomState);
        };
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia(compactReservationQuery);
        const updateCompactState = () => setIsCompact(mediaQuery.matches);

        updateCompactState();
        mediaQuery.addEventListener("change", updateCompactState);

        return () => mediaQuery.removeEventListener("change", updateCompactState);
    }, []);

    const selectedApartment = useMemo(
        () => apartments.find((apartment) => apartment.nb_chambers === roomsCount) ?? apartments[0],
        [apartments, roomsCount],
    );
    const maxGuests = roomsCount === 1 ? 2 : 4;
    const totalPrice = selectedApartment ? selectedApartment.price * daysCount : 0;
    const apartmentOptions: DropdownOption[] = [
        { value: "1", label: t("oneRoom") },
        { value: "2", label: t("twoRooms") },
    ];

    useEffect(() => {
        setGuestsInput(String(Math.min(guests, maxGuests)));
    }, [guests, maxGuests]);

    const notifyError = (message: string) => {
        setNotification({
            status: "error",
            text: message,
            duration: 8000,
        });
    };
    const updateGuests = (value: string, options?: { notify?: boolean }) => {
        setGuestsInput(value);

        if (value.trim() === "") {
            return;
        }

        const nextGuests = Number(value);

        if (!Number.isFinite(nextGuests)) return;

        if (nextGuests > maxGuests) {
            if (options?.notify !== false) {
                notifyError(t("errors.guestsLimit", { count: maxGuests }));
            }

            setGuestsInput(String(guests));
            return;
        }

        const normalizedGuests = Math.max(Math.trunc(nextGuests), 1);

        setGuests(normalizedGuests);
        setGuestsInput(String(normalizedGuests));
    };

    const submitReservation = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email || !email.includes("@")) {
            notifyError(t("errors.email"));
            return;
        }

        if (!checkin || !checkout || daysCount <= 0) {
            notifyError(t("errors.dates"));
            return;
        }

        if (!selectedApartment) {
            notifyError(t("errors.apartment"));
            return;
        }

        if (guests > maxGuests) {
            notifyError(t("errors.guestsLimit", { count: maxGuests }));
            setGuests(maxGuests);
            return;
        }

        setIsSubmitting(true);

        try {
            const invoice = await createInvoice(
                email,
                createReserveId(),
                guests,
                daysCount,
                [],
                {
                    apart_id: apartmentId && apartmentId > 0 ? apartmentId : null,
                    rooms_count: roomsCount,
                    checkin,
                    checkout,
                    days_count: daysCount,
                },
            );

            window.location.assign(invoice.invoice_url);
        } catch {
            notifyError(t("errors.submit"));
            setIsSubmitting(false);
        }
    };

    return (
        <motion.form
            className={cn(s.form, isCompact && !isExpanded && s.form_collapsed)}
            onSubmit={submitReservation}
            initial={{ y: 80, opacity: 0 }}
            animate={{
                y: isAtPageBottom ? 120 : 0,
                opacity: isAtPageBottom ? 0 : 1,
            }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ pointerEvents: isAtPageBottom ? "none" : undefined }}
        >
            <AnimatePresence initial={false}>
                {showFields && (
                    <motion.div
                        className={s.fields}
                        initial={isCompact ? { opacity: 0, height: 0 } : false}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <label className={s.field}>
                            <span>{t("email")}</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder={t("emailPlaceholder")}
                            />
                        </label>
                        <Dropdown
                            label={t("apartment")}
                            value={String(roomsCount)}
                            options={apartmentOptions}
                            onChange={(value) => {
                                const nextRoomsCount = Number(value) === 2 ? 2 : 1;
                                const nextApartment = apartments.find(
                                    (apartment) => apartment.nb_chambers === nextRoomsCount,
                                );

                                setApartment(nextApartment && nextApartment.id > 0 ? nextApartment.id : null, nextRoomsCount);
                            }}
                        />
                        <label className={s.field}>
                            <span>{t("guests")}</span>
                            <input
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={maxGuests}
                                step={1}
                                value={guestsInput}
                                onChange={(event) => updateGuests(event.target.value)}
                                onBlur={(event) => updateGuests(event.target.value, { notify: false })}
                                onFocus={(event) => event.currentTarget.select()}
                            />
                        </label>
                        <div className={s.date_wrap}>
                            <button
                                ref={dateFieldRef}
                                className={s.date_field}
                                type="button"
                                onClick={() => setIsCalendarOpen((value) => !value)}
                            >
                                <CalendarDays />
                                <span>
                                    <small>{t("dates")}</small>
                                    {formatDisplayDate(checkin, t("checkin"))} - {formatDisplayDate(checkout, t("checkout"))}
                                </span>
                            </button>
                            <DatePicker
                                open={isCalendarOpen}
                                disabledDates={disabledDates}
                                triggerRef={dateFieldRef}
                                onClose={() => setIsCalendarOpen(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {showFields && (
                <div className={s.summary}>
                    <span>{daysCount > 0 ? t("nights", { count: daysCount }) : t("selectDates")}</span>
                    <strong>{totalPrice > 0 ? `${totalPrice.toFixed(2)} EUR` : "-"}</strong>
                </div>
            )}
            <div className={s.actions_row}>
                <button className={s.reserve_btn} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className={s.loader} /> : t("reserve")}
                </button>
                {isCompact && (
                    <button
                        className={s.expand_btn}
                        type="button"
                        aria-label={isExpanded ? t("collapse") : t("expand")}
                        aria-expanded={isExpanded}
                        onClick={() => {
                            if (isExpanded) {
                                setIsCalendarOpen(false);
                            }

                            setIsExpanded((current) => !current);
                        }}
                    >
                        {isExpanded ? <ChevronDown /> : <ChevronUp />}
                    </button>
                )}
            </div>
        </motion.form>
    );
};
