"use client";

import cn from "classnames";
import { useState } from "react";
import styles from "./style.module.scss";
import type { ServiceToggleFieldProps } from "./ServiceToggleField.props";

export function ServiceToggleField({
  defaultChecked,
  label,
  name,
  offLabel,
  onLabel,
}: ServiceToggleFieldProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className={styles.field}>
      <span>{label}</span>
      <input type="hidden" name={name} value={checked ? "1" : "0"} />
      <button
        className={cn(styles.toggleButton, checked && styles.active)}
        type="button"
        aria-pressed={checked}
        onClick={() => setChecked((value) => !value)}
      >
        {checked ? onLabel : offLabel}
      </button>
    </div>
  );
}
