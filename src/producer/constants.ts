import { buildConsumerTag } from "@/services"

export const producer = {
  queue: 'messages',
  exchange: 'receiver',
  tag: function (): string {
    return buildConsumerTag(this.queue)
  }

}