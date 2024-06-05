import { decode } from "./decode";

export function decodeCredentials(token: string): {
  message: string;
  chatId: string;
} {
  const payload = decode<{ message: string; phonenumber: string }>(token);
  return { message: payload.message, chatId: payload.phonenumber };
}
