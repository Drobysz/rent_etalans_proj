"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "@/assets/close.svg";
import { formatDateTime, formatMoney } from "@/helpers";
import styles from "./style.module.scss";
import type { PaymentModalProps } from "./PaymentModal.props";

const paymentStatusLabels: Record<string, string> = {
  paid: "Payé",
  pending: "En attente",
  failed: "Échoué",
  refunded: "Remboursé",
};

const paymentProviderLabels: Record<string, string> = {
  stripe: "Stripe",
  manual: "Manuel",
};

export function PaymentModal({ order, onClose }: PaymentModalProps) {
  useEffect(() => {
    if (!order) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, order]);

  return (
    <AnimatePresence>
      {order ? (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          onMouseDown={onClose}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.header}>
              <div>
                <h2 className={styles.title} id="payment-title">
                  Informations de paiement
                </h2>
                <p className={styles.subtitle}>{order.id}</p>
              </div>
              <button className={styles.closeButton} type="button" aria-label="Fermer" onClick={onClose}>
                <CloseIcon aria-hidden="true" />
              </button>
            </div>

            <dl className={styles.details}>
              <div>
                <dt>Statut</dt>
                <dd>{paymentStatusLabels[order.payment.status] ?? order.payment.status}</dd>
              </div>
              <div>
                <dt>Montant</dt>
                <dd>{formatMoney(order.payment.amount)}</dd>
              </div>
              <div>
                <dt>Fournisseur</dt>
                <dd>{paymentProviderLabels[order.payment.provider] ?? order.payment.provider}</dd>
              </div>
              <div>
                <dt>Transaction</dt>
                <dd>{order.payment.transactionId}</dd>
              </div>
              <div>
                <dt>Moyen de paiement</dt>
                <dd>{order.payment.paymentMethod}</dd>
              </div>
              <div>
                <dt>Email du reçu</dt>
                <dd>{order.payment.receiptEmail}</dd>
              </div>
              <div>
                <dt>Créé le</dt>
                <dd>{formatDateTime(order.payment.createdAt)}</dd>
              </div>
            </dl>

            {(order.reservationCode || order.checkin || order.checkout) ? (
              <div className={styles.reservation}>
                <h3>Réservation</h3>
                <dl>
                  {[
                    ["Code", order.reservationCode ?? order.reserveId],
                    ["Appartement", order.apartmentName],
                    ["Arrivée", order.checkin],
                    ["Départ", order.checkout],
                    ["Email client", order.guestEmail],
                    ["Statut", paymentStatusLabels[order.payment.status] ?? order.payment.status],
                    ["Montant", formatMoney(order.total)],
                  ].filter(([, value]) => value).map(([label, value]) => (
                    <div key={`${label}_${value}`}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            <div className={styles.metadata}>
              <h3>Métadonnées</h3>
              <dl>
                {Object.entries(order.payment.metadata).map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
