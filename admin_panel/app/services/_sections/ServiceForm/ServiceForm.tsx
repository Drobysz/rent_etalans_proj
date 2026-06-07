"use client";

import { useActionState } from "react";
import {
  ServiceFormActions,
  ServiceFormHeader,
  ServiceImageField,
  ServiceTextareaField,
  ServiceTextField,
  ServiceToggleField,
} from "./_components";
import { NotificationToast } from "@/components";
import type { ServiceFormActionState } from "./ServiceForm.schema";
import type { ServiceFormProps } from "./ServiceForm.props";
import styles from "./style.module.scss";

const initialState: ServiceFormActionState = {};

export function ServiceForm({
  action,
  imageRequired = true,
  mode,
  service,
}: ServiceFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section className={styles.section}>
      <ServiceFormHeader mode={mode} />

      <form className={styles.form} action={formAction}>
        {service ? <input type="hidden" name="serviceId" value={service.id} /> : null}
        <ServiceTextField
          label="Name"
          name="name"
          maxLength={30}
          defaultValue={service?.name}
          error={state.fieldErrors?.name}
        />
        <ServiceTextField
          label="Price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={service?.price}
          error={state.fieldErrors?.price}
        />
        <ServiceTextareaField
          label="Description"
          name="description"
          maxLength={500}
          rows={6}
          defaultValue={service?.description}
          error={state.fieldErrors?.description}
        />
        <div className={styles.statusGrid}>
          <ServiceToggleField
            label="Visibility"
            name="visible"
            defaultChecked={service?.visible ?? true}
            onLabel="Visible"
            offLabel="Hidden"
          />
          <ServiceToggleField
            label="Price"
            name="fixed_price"
            defaultChecked={service?.fixedPrice ?? false}
            onLabel="Fixed price"
            offLabel="Per day"
          />
        </div>
        <ServiceImageField
          error={state.fieldErrors?.images}
          existingImages={service?.images ?? []}
          required={imageRequired}
        />

        {state.message ? <p className={styles.message}>{state.message}</p> : null}
        <NotificationToast notification={state.notification} />

        <ServiceFormActions mode={mode} pending={pending} />
      </form>
    </section>
  );
}
