import { env } from "../infra/config";
import { verify } from "jsonwebtoken";

export function decode<T>(token: string): T {
  return verify(token, env.CHAT_API_SECRET) as T;
}
