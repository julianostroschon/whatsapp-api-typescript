const twoDigits = '2-digit';

export function parseDate(data: number): string {
  return new Date(data).toLocaleString('pt-BR', {
    year: 'numeric',
    month: twoDigits,
    day: twoDigits,
    hour: twoDigits,
    minute: twoDigits,
    second: twoDigits,
  });
}