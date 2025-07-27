import { addMonths, differenceInMonths, subDays } from 'date-fns';

/**
 * Calculate the monthly period start date for subscription credits. This
 * determines when a user should receive their monthly credits based on their
 * subscription start date.
 */
export function calculateMonthlyPeriodStart(
  stripeCurrentPeriodStart: Date
): Date {
  const start = new Date(stripeCurrentPeriodStart);
  const today = subDays(new Date(), 1); // Subtract one day for the subscription end check

  // Calculate the number of full months elapsed
  const monthsElapsed = differenceInMonths(today, start);

  // If no months have elapsed or negative (future date), return the start date
  if (monthsElapsed <= 0) {
    return start;
  }

  // Add the elapsed months to the start date to get the current period start
  return addMonths(start, monthsElapsed);
}
