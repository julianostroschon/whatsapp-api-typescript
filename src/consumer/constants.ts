import { buildConsumerTag } from "@/services"

export const consumer = {
  queue: 'oito',
  exchange: 'nove',
  tag: function () {
    return buildConsumerTag(this.queue)
  }
}