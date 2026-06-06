import { notFound } from "next/navigation";
import { ServiceForm } from "../../_sections";
import { getService } from "@/queries";
import { updateServiceAction } from "./actions";

type EditServicePageProps = {
  params: Promise<{
    serviceId: string;
  }>;
};

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { serviceId } = await params;
  const service = await getService(serviceId);

  if (!service) {
    notFound();
  }

  return (
    <ServiceForm
      action={updateServiceAction}
      imageRequired={false}
      mode="edit"
      service={service}
    />
  );
}
