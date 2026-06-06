import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SessionPayload } from "@/interfaces";
import { decryptSession, encryptSession } from "./encrypt";

const SESSION_COOKIE = "admin_panel_session";

export async function createSession(payload: SessionPayload) {
  const cookieStore = await cookies();
  const encrypted = await encryptSession(payload);

  cookieStore.set(SESSION_COOKIE, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(payload.expiresAt),
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;

  if (!value) {
    return null;
  }

  return decryptSession(value);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireUser() {
  const session = await getSession();

  if (!session) {
    redirect("/admin_panel/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireUser();

  if (!["admin", "superadmin"].includes(session.role)) {
    redirect("/admin_panel/login");
  }

  return session;
}

export async function requireSuperadmin() {
  const session = await requireUser();

  if (session.role !== "superadmin") {
    redirect("/admin_panel/login");
  }

  return session;
}
