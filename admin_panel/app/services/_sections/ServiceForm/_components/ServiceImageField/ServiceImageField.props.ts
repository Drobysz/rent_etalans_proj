import type { ServiceImage } from "@/interfaces";

export type ServiceImageFieldProps = {
  error?: string;
  existingImage?: ServiceImage;
  required?: boolean;
};
