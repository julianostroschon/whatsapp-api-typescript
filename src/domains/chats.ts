import { decode } from "./decode"

export function decodeChatId(token: string): string {
  const payload = decode<{ chatId: string }>(token)
  return payload.chatId
}