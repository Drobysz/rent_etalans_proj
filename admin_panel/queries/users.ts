import { getSession } from "@/auth/sessions";
import type { User, UserRole } from "@/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

type ApiUser = {
  id: string | number;
  name: string;
  tg_nickname: string;
  role: UserRole;
};

export const mockUsers: User[] = [
  { id: "user-admin", name: "admin", tgNickname: "admin", role: "admin" },
  { id: "user-client", name: "client", tgNickname: "client", role: "client" },
];

export async function getUsers(): Promise<User[]> {
  const session = await getSession();

  if (!API_URL || !session?.accessToken) {
    return mockUsers;
  }

  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return mockUsers;
    }

    const payload = (await response.json()) as { data?: ApiUser[] };
    return (payload.data ?? []).map(mapUser);
  } catch {
    return mockUsers;
  }
}

export function mapUser(user: ApiUser): User {
  return {
    id: String(user.id),
    name: user.name,
    tgNickname: user.tg_nickname,
    role: user.role,
  };
}
