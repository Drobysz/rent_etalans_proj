"use client";

import cn from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import type { NotificationToastProps } from "./NotificationToast.props";
import type { AppNotification } from "@/interfaces";

function ToastItem({ notification }: { notification: AppNotification }) {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setVisible(false), 5000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key={notification.id}
          className={cn(styles.toast, styles[notification.status])}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
        >
          {notification.message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function NotificationToast({ notification }: NotificationToastProps) {
  return notification ? <ToastItem key={notification.id} notification={notification} /> : null;
}
