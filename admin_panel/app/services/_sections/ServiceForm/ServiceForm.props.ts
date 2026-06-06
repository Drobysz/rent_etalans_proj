import type { Service } from "@/interfaces";
import type { ServiceFormAction } from "./ServiceForm.schema";

export type ServiceFormMode = "create" | "edit";

export type ServiceFormProps = {
  action: ServiceFormAction;
  imageRequired?: boolean;
  mode: ServiceFormMode;
  service?: Service;
};
