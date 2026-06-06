"use client";

import { useActionState } from "react";
import { loginAction, type LoginActionState } from "@/auth/actions";
import styles from "./style.module.scss";

const initialState: LoginActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className={styles.form} action={formAction}>
      <label className={styles.field}>
        <span>Name</span>
        <input name="name" type="text" autoComplete="username" aria-invalid={Boolean(state.fieldErrors?.name)} />
        {state.fieldErrors?.name ? <strong>{state.fieldErrors.name}</strong> : null}
      </label>

      <label className={styles.field}>
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        {state.fieldErrors?.password ? <strong>{state.fieldErrors.password}</strong> : null}
      </label>

      {state.message ? <p className={styles.error}>{state.message}</p> : null}

      <button className={styles.submitButton} type="submit" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
