import { differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';


export function sincePosted(date: Date | number): string {
  const now = new Date();
  const minutesSincePosted = differenceInMinutes(now, date);
  const hoursSincePosted = differenceInHours(now, date);
  const daysSincePosted = differenceInDays(now, date);
  const monthsSincePosted = differenceInMonths(now, date);
  const yearsSincePosted = differenceInYears(now, date);

  if (minutesSincePosted < 1) {
    return 'now';
  }
  if (minutesSincePosted < 60) {
    return `${minutesSincePosted}m`;
  }

  if (hoursSincePosted < 24) {
    return `${hoursSincePosted}h`;
  }

  if (daysSincePosted < 30) {
    return `${daysSincePosted}d`;
  }

  if (monthsSincePosted < 12) {
    return `${monthsSincePosted}mo`;
  }

  return `${yearsSincePosted}y`;
}