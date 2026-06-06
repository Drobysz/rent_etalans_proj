import type { Service } from "@/interfaces";

export type ServiceCardProps = {
  deleteAction: (formData: FormData) => Promise<void>;
  service: Service;
};
