"use server";

import { redirect } from "next/navigation";
import type { User } from "@/interfaces";
import { loginFormSchema } from "./FormSchemes";
import { createSession, deleteSession } from "./sessions";

const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

type LoginResponse = {
  token: string;
  user: {
    id: string | number;
    name: string;
    tg_nickname: string;
    role: User["role"];
  };
};

export type LoginActionState = {
  message?: string;
  fieldErrors?: Partial<Record<"name" | "password", string>>;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginFormSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;

    return {
      fieldErrors: {
        name: flattened.name?.[0],
        password: flattened.password?.[0],
      },
    };
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return { message: "API_URL is not configured." };
  }

  let payload: LoginResponse;

  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    payload = (await response.json()) as LoginResponse;

    if (!response.ok) {
      return { message: "Name or password is incorrect." };
    }
  } catch {
    return { message: "Unable to reach the API." };
  }

  if (!["admin", "superadmin"].includes(payload.user.role)) {
    return { message: "This account does not have admin access." };
  }

  await createSession({
    id: String(payload.user.id),
    userId: String(payload.user.id),
    name: payload.user.name,
    tgNickname: payload.user.tg_nickname,
    role: payload.user.role,
    accessToken: payload.token,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  redirect("/");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
