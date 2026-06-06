import type { SessionPayload } from "@/interfaces";

export type AdminLayoutProps = {
  children: React.ReactNode;
  user: SessionPayload;
};
