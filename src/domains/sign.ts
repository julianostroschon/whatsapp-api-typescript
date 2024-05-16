import { env } from "../infra/config";
import { sign as signToken } from "jsonwebtoken";

export function constructToken(message: string, phonenumber?: string): { token: string } {
  const payload = { message, phonenumber }
  return { token: sign(payload) };
}

export function sign(payload: string | object | Buffer): string {
  return signToken(payload, env.CHAT_API_SECRET)
}