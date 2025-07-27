import { parseISO } from 'date-fns';
import { z } from 'zod';

// Helper function to normalize date values
export const normalizeDate = (
  date: number | string | undefined
): number | undefined => {
  if (!date) return undefined;
  if (typeof date === 'number') return date;

  // If it's a string, try to parse it as a date
  const parsed = new Date(date).getTime();

  return Number.isNaN(parsed) ? undefined : parsed;
};

export const parseYM = (year?: string | null, month = '01') => {
  if (!year) return null;

  return parseISO(`${year}-${month!.padStart(2, '0')}-01Z`);
};

const dateRegex = /^([12]\d{3}-[01]\d-[0-3]\d|[12]\d{3}-[01]\d|[12]\d{3})$/;

export const iso8601Schema = z
  .string()
  .regex(dateRegex, {
    message:
      'Invalid date format. Expected formats are YYYY-MM-DD, YYYY-MM, or YYYY.',
  })
  .or(z.literal(''))
  .describe(
    'Similar to the standard date type, but each section after the year is optional. e.g. 2014-06-29 or 2023-04'
  );
