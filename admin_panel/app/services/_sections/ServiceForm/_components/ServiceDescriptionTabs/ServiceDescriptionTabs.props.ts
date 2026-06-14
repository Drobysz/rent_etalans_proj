import type {
  ServiceDescriptionErrors,
  ServiceDescriptionLocale,
} from "../../ServiceForm.schema";

export type ServiceDescriptionValues = Record<ServiceDescriptionLocale, string>;

export type ServiceDescriptionTabsProps = {
  defaultValues?: Partial<ServiceDescriptionValues>;
  errors?: ServiceDescriptionErrors;
  maxLength?: number;
  rows?: number;
};
