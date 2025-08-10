import { packageInfo } from "../../infra/constants";
import { parseDate } from "../../utils/date";

export function buildConsumerTag(queue: string): string {
  const appVersion = packageInfo.version ?? 'v?';
  const timestamp = new Date().getTime();

  return `${packageInfo.name}-${appVersion}-${queue}-${parseDate(
    timestamp
  )}`;
}