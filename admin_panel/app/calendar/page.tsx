import { getBlockedDates } from "@/queries/calendar";
import { CalendarManager } from "./_sections/CalendarManager/CalendarManager";

export default async function CalendarPage() {
  const blockedDates = await getBlockedDates().catch(() => []);

  return <CalendarManager initialBlockedDates={blockedDates} />;
}
