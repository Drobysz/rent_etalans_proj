"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginActionState } from "@/auth/actions";
import styles from "./style.module.scss";

const initialState: LoginActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className={styles.form} action={formAction}>
      <label className={styles.field}>
        <span>Name</span>
        <input name="name" type="text" autoComplete="username" aria-invalid={Boolean(state.fieldErrors?.name)} />
        {state.fieldErrors?.name ? <strong>{state.fieldErrors.name}</strong> : null}
      </label>

      <label className={styles.field}>
        <span>Password</span>
        <div className={styles.passwordField}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={Boolean(state.fieldErrors?.password)}
          />
          <button
            className={styles.passwordToggle}
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 5.1A8.8 8.8 0 0 1 12 4.9c5 0 8.5 4.2 9.6 6.1a1.9 1.9 0 0 1 0 2c-.4.7-1 1.5-1.8 2.3" />
                <path d="M6.6 6.7A15.5 15.5 0 0 0 2.4 11a1.9 1.9 0 0 0 0 2c1.1 1.9 4.6 6.1 9.6 6.1a8.9 8.9 0 0 0 4.8-1.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.4 11a1.9 1.9 0 0 0 0 2c1.1 1.9 4.6 6.1 9.6 6.1s8.5-4.2 9.6-6.1a1.9 1.9 0 0 0 0-2C20.5 9.1 17 4.9 12 4.9S3.5 9.1 2.4 11Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {state.fieldErrors?.password ? <strong>{state.fieldErrors.password}</strong> : null}
      </label>

      {state.message ? <p className={styles.error}>{state.message}</p> : null}

      <button className={styles.submitButton} type="submit" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
