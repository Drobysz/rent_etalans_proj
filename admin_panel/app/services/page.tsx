import { ServicesList } from "./_sections";
import { NotificationToast } from "@/components";
import { getServices } from "@/queries";
import type { AppNotification } from "@/interfaces";

type ServicesPageProps = {
  searchParams: Promise<{
    notification?: string;
  }>;
};

const notificationMessages: Record<string, AppNotification> = {
  "service-created": {
    id: "service-created",
    status: "success",
    message: "Le service a été créé.",
  },
  "service-updated": {
    id: "service-updated",
    status: "success",
    message: "Le service a été mis à jour.",
  },
  "service-deleted": {
    id: "service-deleted",
    status: "success",
    message: "Le service a été supprimé.",
  },
  "service-delete-failed": {
    id: "service-delete-failed",
    status: "error",
    message: "Le service n'a pas été supprimé.",
  },
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const result = await getServices();
  const notification = params.notification
    ? notificationMessages[params.notification]
    : result.notification;

  return (
    <>
      <ServicesList services={result.services} />
      <NotificationToast notification={notification} />
    </>
  );
}
