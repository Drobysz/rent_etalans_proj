"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "@/assets/close.svg";
import { formatDateTime, formatMoney } from "@/helpers";
import styles from "./style.module.scss";
import type { PaymentModalProps } from "./PaymentModal.props";

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
                  Payment information
                </h2>
                <p className={styles.subtitle}>{order.id}</p>
              </div>
              <button className={styles.closeButton} type="button" aria-label="Close" onClick={onClose}>
                <CloseIcon aria-hidden="true" />
              </button>
            </div>

            <dl className={styles.details}>
              <div>
                <dt>Status</dt>
                <dd>{order.payment.status}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>{formatMoney(order.payment.amount)}</dd>
              </div>
              <div>
                <dt>Provider</dt>
                <dd>{order.payment.provider}</dd>
              </div>
              <div>
                <dt>Transaction</dt>
                <dd>{order.payment.transactionId}</dd>
              </div>
              <div>
                <dt>Payment method</dt>
                <dd>{order.payment.paymentMethod}</dd>
              </div>
              <div>
                <dt>Receipt email</dt>
                <dd>{order.payment.receiptEmail}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{formatDateTime(order.payment.createdAt)}</dd>
              </div>
            </dl>

            <div className={styles.metadata}>
              <h3>Metadata</h3>
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
