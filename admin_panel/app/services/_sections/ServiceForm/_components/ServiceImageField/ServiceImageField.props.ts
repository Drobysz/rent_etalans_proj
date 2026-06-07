import type { ServiceImage } from "@/interfaces";

export type ServiceImageFieldProps = {
  error?: string;
  existingImages?: ServiceImage[];
  required?: boolean;
};
