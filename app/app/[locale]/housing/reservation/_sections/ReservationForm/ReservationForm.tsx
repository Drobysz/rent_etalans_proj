"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Apartment } from "@/types";
import { getApartments } from "@/queries/apartments";
import { createInvoice } from "@/queries/createInvoice";
import { getReservationAvailability } from "@/queries/reservationAvailability";
import { useWindowWidth } from "@/hooks";
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
    const [calendarAnchorLeft, setCalendarAnchorLeft] = useState<number | undefined>();
    const formRef = useRef<HTMLFormElement | null>(null);
    const dateFieldRef = useRef<HTMLButtonElement | null>(null);
    const windowWidth = useWindowWidth() as number;
    const isCompact = windowWidth > 0 && windowWidth < 860;
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
        if (!isCalendarOpen) return;

        const updateCalendarAnchor = () => {
            const formRect = formRef.current?.getBoundingClientRect();
            const fieldRect = dateFieldRef.current?.getBoundingClientRect();

            if (!formRect || !fieldRect) return;

            const calendarWidth = Math.min(344, window.innerWidth - 32);
            const desiredLeft = fieldRect.left - formRect.left + fieldRect.width / 2;
            const minLeft = calendarWidth / 2 + 16 - formRect.left;
            const maxLeft = window.innerWidth - 16 - formRect.left - calendarWidth / 2;

            setCalendarAnchorLeft(Math.min(Math.max(desiredLeft, minLeft), maxLeft));
        };

        updateCalendarAnchor();
        window.addEventListener("resize", updateCalendarAnchor);
        window.addEventListener("scroll", updateCalendarAnchor, { passive: true });

        return () => {
            window.removeEventListener("resize", updateCalendarAnchor);
            window.removeEventListener("scroll", updateCalendarAnchor);
        };
    }, [isCalendarOpen, isCompact, showFields]);

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
    const guestOptions: DropdownOption[] = Array.from({ length: maxGuests }, (_, index) => {
        const guestCount = index + 1;

        return {
            value: String(guestCount),
            label: String(guestCount),
        };
    });

    const notifyError = (message: string) => {
        setNotification({
            status: "error",
            text: message,
            duration: 8000,
        });
    };

    const submitReservation = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isCompact && !isExpanded) {
            setIsExpanded(true);
            return;
        }

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
            ref={formRef}
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
                        <Dropdown
                            label={t("guests")}
                            value={String(guests)}
                            options={guestOptions}
                            onChange={(value) => setGuests(Number(value))}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {showFields && (
                <div className={s.summary}>
                    <span>{daysCount > 0 ? t("nights", { count: daysCount }) : t("selectDates")}</span>
                    <strong>{totalPrice > 0 ? `${totalPrice.toFixed(2)} EUR` : "-"}</strong>
                </div>
            )}
            <button className={s.reserve_btn} type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className={s.loader} /> : t("reserve")}
            </button>
            <DatePicker
                open={isCalendarOpen}
                disabledDates={disabledDates}
                anchorLeft={calendarAnchorLeft}
                onClose={() => setIsCalendarOpen(false)}
            />
        </motion.form>
    );
};
