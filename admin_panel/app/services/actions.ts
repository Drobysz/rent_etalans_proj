"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/auth/sessions";

export async function deleteServiceAction(formData: FormData) {
  const serviceId = String(formData.get("serviceId") ?? "");
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!serviceId || !apiUrl) {
    redirect("/services?notification=service-delete-failed");
  }

  const session = await requireAdmin();

  try {
    const response = await fetch(`${apiUrl}/services/${serviceId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      redirect("/services?notification=service-delete-failed");
    }
  } catch {
    redirect("/services?notification=service-delete-failed");
  }

  redirect("/services?notification=service-deleted");
}
