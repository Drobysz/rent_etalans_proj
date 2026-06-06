"use client";

import { useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { saveUserAction, type UserFormState } from "../../../../actions";
import CloseIcon from "@/assets/close.svg";
import styles from "./style.module.scss";
import type { UserModalProps } from "./UserModal.props";

const initialState: UserFormState = {};

export function UserModal({ mode, open, user, onClose }: UserModalProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveUserAction, initialState);
  const isEditing = mode === "edit";

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [onClose, router, state.success]);

  return (
    <AnimatePresence>
      {open ? (
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.header}>
              <div>
                <h2 id="user-modal-title">{isEditing ? "Edit user" : "Create user"}</h2>
                <p>{isEditing ? "Update access details." : "Create admin or client access."}</p>
              </div>
              <button className={styles.closeButton} type="button" aria-label="Close" onClick={onClose}>
                <CloseIcon aria-hidden="true" />
              </button>
            </div>

            <form className={styles.form} action={formAction}>
              <input type="hidden" name="id" value={user?.id ?? ""} />
              <label className={styles.field}>
                <span>Name</span>
                <input name="name" defaultValue={user?.name ?? ""} autoComplete="username" />
                {state.fieldErrors?.name ? <strong>{state.fieldErrors.name}</strong> : null}
              </label>

              <label className={styles.field}>
                <span>Telegram nickname</span>
                <input name="tgNickname" defaultValue={user?.tgNickname ?? ""} autoComplete="off" />
                {state.fieldErrors?.tgNickname ? <strong>{state.fieldErrors.tgNickname}</strong> : null}
              </label>

              <label className={styles.field}>
                <span>Role</span>
                <select name="role" defaultValue={user?.role === "admin" ? "admin" : "client"}>
                  <option value="admin">admin</option>
                  <option value="client">client</option>
                </select>
                {state.fieldErrors?.role ? <strong>{state.fieldErrors.role}</strong> : null}
              </label>

              <label className={styles.field}>
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  autoComplete={isEditing ? "new-password" : "new-password"}
                  placeholder={isEditing ? "Leave empty to keep current" : ""}
                />
                {state.fieldErrors?.password ? <strong>{state.fieldErrors.password}</strong> : null}
              </label>

              {state.message ? <p className={styles.error}>{state.message}</p> : null}

              <div className={styles.actions}>
                <button className={styles.secondaryButton} type="button" onClick={onClose}>
                  Cancel
                </button>
                <button className={styles.primaryButton} type="submit" disabled={pending}>
                  {pending ? "Saving" : "Save user"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
