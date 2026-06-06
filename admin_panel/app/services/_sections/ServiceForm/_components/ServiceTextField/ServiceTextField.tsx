import styles from "./style.module.scss";
import type { ServiceTextFieldProps } from "./ServiceTextField.props";

export function ServiceTextField({
  defaultValue,
  error,
  label,
  maxLength,
  min,
  name,
  step,
  type = "text",
}: ServiceTextFieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        name={name}
        type={type}
        maxLength={maxLength}
        min={min}
        step={step}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
      />
      {error ? <strong>{error}</strong> : null}
    </label>
  );
}
