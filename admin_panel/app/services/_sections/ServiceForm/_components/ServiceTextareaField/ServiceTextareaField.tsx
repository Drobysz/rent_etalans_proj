import styles from "./style.module.scss";
import type { ServiceTextareaFieldProps } from "./ServiceTextareaField.props";

export function ServiceTextareaField({
  defaultValue,
  error,
  label,
  maxLength,
  name,
  rows = 6,
}: ServiceTextareaFieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <textarea
        name={name}
        maxLength={maxLength}
        rows={rows}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
      />
      {error ? <strong>{error}</strong> : null}
    </label>
  );
}
