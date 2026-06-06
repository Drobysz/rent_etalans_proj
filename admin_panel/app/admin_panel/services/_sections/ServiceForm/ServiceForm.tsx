"use client";

import { useActionState } from "react";
import { createServiceAction, type CreateServiceActionState } from "../../new/actions";
import {
  ServiceFormActions,
  ServiceFormHeader,
  ServiceImageField,
  ServiceTextareaField,
  ServiceTextField,
} from "./_components";
import styles from "./style.module.scss";

const initialState: CreateServiceActionState = {};

export function ServiceForm() {
  const [state, formAction, pending] = useActionState(createServiceAction, initialState);

  return (
    <section className={styles.section}>
      <ServiceFormHeader />

      <form className={styles.form} action={formAction}>
        <ServiceTextField
          label="Name"
          name="name"
          maxLength={30}
          error={state.fieldErrors?.name}
        />
        <ServiceTextField
          label="Price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          error={state.fieldErrors?.price}
        />
        <ServiceTextareaField
          label="Description"
          name="description"
          maxLength={500}
          rows={6}
          error={state.fieldErrors?.description}
        />
        <ServiceImageField error={state.fieldErrors?.images} />

        {state.message ? <p className={styles.message}>{state.message}</p> : null}

        <ServiceFormActions pending={pending} />
      </form>
    </section>
  );
}
