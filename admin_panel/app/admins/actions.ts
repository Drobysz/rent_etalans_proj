"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/auth/sessions";
import type { User, UserRole } from "@/interfaces";
import { getBackendApiUrl } from "@/lib/api";
import { mapUser } from "@/queries/users";

type ApiUser = {
  id: string | number;
  name: string;
  tg_nickname: string;
  role: UserRole;
};

export type UserFormState = {
  success?: boolean;
  user?: User;
  message?: string;
  fieldErrors?: Partial<Record<"name" | "tgNickname" | "role" | "password", string>>;
};

export async function saveUserAction(
  _previousState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const id = String(formData.get("id") ?? "");
  const isEditing = Boolean(id);
  const name = String(formData.get("name") ?? "").trim();
  const tgNickname = String(formData.get("tgNickname") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  const password = String(formData.get("password") ?? "");
  const fieldErrors: UserFormState["fieldErrors"] = {};

  if (!name) {
    fieldErrors.name = "Enter a name.";
  }

  if (!tgNickname) {
    fieldErrors.tgNickname = "Enter a Telegram nickname.";
  }

  if (!["admin", "client"].includes(role)) {
    fieldErrors.role = "Choose admin or client.";
  }

  if (!isEditing && password.length < 8) {
    fieldErrors.password = "Use at least 8 characters.";
  }

  if (isEditing && password && password.length < 8) {
    fieldErrors.password = "Use at least 8 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const session = await getSession();
  const apiUrl = getBackendApiUrl(`/users${isEditing ? `/${id}` : ""}`);

  if (!apiUrl || !session?.accessToken || session.role !== "superadmin") {
    return { message: "Superadmin session is required." };
  }

  const body: Record<string, string> = {
    name,
    tg_nickname: tgNickname,
    role,
  };

  if (password) {
    body.password = password;
  }

  try {
    const response = await fetch(apiUrl, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as { data?: ApiUser; message?: string };

    if (!response.ok || !payload?.data) {
      return { message: payload?.message ?? "Unable to save user." };
    }

    revalidatePath("/admins");

    return {
      success: true,
      user: mapUser(payload.data),
    };
  } catch {
    return { message: "Unable to reach the API." };
  }
}
