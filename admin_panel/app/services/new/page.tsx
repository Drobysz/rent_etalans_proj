import { ServiceForm } from "../_sections";
import { createServiceAction } from "./actions";

export default function NewServicePage() {
  return <ServiceForm action={createServiceAction} mode="create" />;
}
