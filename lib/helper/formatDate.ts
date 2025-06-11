export function formatIndonesianDate(dateInput?: string | Date): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
