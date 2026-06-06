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
    message: "Service was created.",
  },
  "service-updated": {
    id: "service-updated",
    status: "success",
    message: "Service was updated.",
  },
  "service-deleted": {
    id: "service-deleted",
    status: "success",
    message: "Service was deleted.",
  },
  "service-delete-failed": {
    id: "service-delete-failed",
    status: "error",
    message: "Service was not deleted.",
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
