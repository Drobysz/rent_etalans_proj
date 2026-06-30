import "server-only";
import { SignJWT, jwtVerify } from 'jose';
import { Payments } from "@/types";
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: Payments) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = ''): Promise<Payments | undefined> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as Payments
  } catch (error) {
    console.log(`Failed to verify session. Error: ${String(error)}`)
  }
}