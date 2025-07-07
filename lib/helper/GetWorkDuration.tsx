/**
 * Calculates the duration between createdAt and dueDate, and returns a human-readable string.
 *
 * Format rules:
 * - If dueDate is not set (null or undefined), returns "Not set".
 * - If duration >= 1 year, returns "{n} year(s) leave".
 * - Else if duration >= 1 month, returns "{n} month(s) leave".
 * - Else if duration >= 1 week, returns "{n} week(s) leave".
 * - Else if duration >= 1 day, returns "{n} day(s) leave".
 * - Else if duration < 1 day, returns "{n} hour(s) {m} minute(s) leave".
 *
 * @param createdAt - The start date (required)
 * @param dueDate - The due date (optional). If null/undefined, it returns "Not set".
 * @returns A human-readable duration string.
 */

// const createdAt = new Date('2023-07-01');
// const dueDate = new Date('2025-07-06');

// console.log(getWorkDuration(createdAt, dueDate));
// // Output: "2 years leave"

// console.log(getWorkDuration(createdAt, null));
// // Output: "Not set"

// console.log(getWorkDuration(new Date(), new Date(Date.now() + 1000 * 60 * 90)));
// // Output: "1 hour 30 minutes leave"

export function getWorkDuration(
  createdAt: Date,
  dueDate?: Date | null,
): string {
  if (!dueDate) return 'Not set';

  const ms = dueDate.getTime() - createdAt.getTime();
  if (ms <= 0) return 'Already due';

  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) {
    return `${years} year${years > 1 ? 's' : ''} leave`;
  }

  if (months >= 1) {
    return `${months} month${months > 1 ? 's' : ''} leave`;
  }

  if (weeks >= 1) {
    return `${weeks} week${weeks > 1 ? 's' : ''} leave`;
  }

  if (days >= 1) {
    return `${days} day${days > 1 ? 's' : ''} leave`;
  }

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  return `${remainingHours} hour${
    remainingHours !== 1 ? 's' : ''
  } ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} leave`;
}
