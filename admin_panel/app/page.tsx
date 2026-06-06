import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/admin_panel/dashboard");
}
