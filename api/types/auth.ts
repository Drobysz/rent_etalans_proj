export type UserRole = "superadmin" | "admin" | "client";

export type User = {
  id: string;
  name: string;
  tg_nickname: string;
  role: UserRole;
};

export type AuthUser = Pick<User, "id" | "name" | "tg_nickname" | "role">;
