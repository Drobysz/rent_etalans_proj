import { jwtVerify, SignJWT } from "jose";
import type { SessionPayload } from "@/interfaces";

const algorithm = "HS256";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export function isSessionExpired(payload: Pick<SessionPayload, "expiresAt">) {
  return payload.expiresAt <= Date.now();
}

export async function encryptSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(new Date(payload.expiresAt))
    .sign(getSecret());
}

export async function decryptSession(value: string) {
  try {
    const { payload } = await jwtVerify(value, getSecret(), {
      algorithms: [algorithm],
    });

    const session = payload as unknown as SessionPayload;

    if (
      !session.userId ||
      !session.name ||
      !session.tgNickname ||
      !session.role ||
      !session.accessToken ||
      isSessionExpired(session)
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
