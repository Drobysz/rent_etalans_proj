import { ServicesList } from "./_sections";
import { getServices } from "@/queries";

export default async function ServicesPage() {
  const services = await getServices();

  return <ServicesList services={services} />;
}
