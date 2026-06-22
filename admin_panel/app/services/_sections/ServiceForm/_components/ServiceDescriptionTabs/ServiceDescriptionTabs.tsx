"use client";

import { useState } from "react";
import {
  serviceDescriptionLabels,
  serviceDescriptionLocales,
  type ServiceDescriptionLocale,
} from "../../ServiceForm.schema";
import type { ServiceDescriptionTabsProps } from "./ServiceDescriptionTabs.props";
import styles from "./style.module.scss";

export function ServiceDescriptionTabs({
  defaultValues,
  errors,
  maxLength,
  rows = 6,
}: ServiceDescriptionTabsProps) {
  const [activeLocale, setActiveLocale] = useState<ServiceDescriptionLocale>("en");

  return (
    <fieldset className={styles.fieldset}>
      <legend>Description</legend>

      <div className={styles.tabs} role="tablist" aria-label="Langue de description">
        {serviceDescriptionLocales.map((locale) => (
          <button
            aria-selected={activeLocale === locale}
            className={activeLocale === locale ? styles.tabActive : styles.tab}
            key={locale}
            onClick={() => setActiveLocale(locale)}
            role="tab"
            type="button"
          >
            {serviceDescriptionLabels[locale]}
          </button>
        ))}
      </div>

      {serviceDescriptionLocales.map((locale) => (
        <label
          className={activeLocale === locale ? styles.panelActive : styles.panel}
          key={locale}
        >
          <span>{serviceDescriptionLabels[locale]}</span>
          <textarea
            aria-invalid={Boolean(errors?.[locale])}
            defaultValue={defaultValues?.[locale]}
            maxLength={maxLength}
            name={`descriptions[${locale}]`}
            rows={rows}
          />
          {errors?.[locale] ? <strong>{errors[locale]}</strong> : null}
        </label>
      ))}
    </fieldset>
  );
}
