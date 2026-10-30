// Reusable sorting utilities for descending chronological order (latest first)

const MONTH_MAP: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

/**
 * Parses date strings like "Present", "Ongoing (2026)", "Expected completion: 2027",
 * "Oct 2025", "September 2024", "2023-11", "2026", "Jun 2019 - Jan 2022"
 * into a comparable numeric score (YYYYMM).
 * Active/ongoing items yield the highest tier score (999999 or year * 100 + 99).
 */
export function parseDateToScore(dateStr?: string, isOngoing?: boolean): number {
  if (isOngoing) {
    return 999999;
  }
  if (!dateStr) {
    return 0;
  }

  const clean = dateStr.trim().toLowerCase();

  // Handle present, ongoing, or current
  if (clean.includes('present') || clean.includes('current')) {
    return 999999;
  }

  if (clean.includes('ongoing')) {
    const yMatch = clean.match(/\b(20\d\d)\b/);
    return yMatch ? parseInt(yMatch[1], 10) * 100 + 99 : 999999;
  }

  // If a range is provided, e.g. "Jun 2019 - Jan 2022" or "2023 - 2027", focus on the end date
  let target = clean;
  if (target.includes(' - ') || target.includes(' – ') || target.includes(' to ')) {
    const parts = target.split(/\s*[-–]|to\s*/);
    target = parts[parts.length - 1].trim();
  }

  // Handle ISO format: "2025-10" or "2025/10"
  const isoMatch = target.match(/\b(20\d\d)[-/](\d{1,2})\b/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    return year * 100 + month;
  }

  // Look for 4-digit year
  const yearMatch = target.match(/\b(19\d\d|20\d\d)\b/);
  if (!yearMatch) {
    return 0;
  }
  const year = parseInt(yearMatch[1], 10);

  // Look for month name in the string
  let month = 12; // Default to end-of-year if only year is specified
  for (const [mName, mVal] of Object.entries(MONTH_MAP)) {
    if (new RegExp('\\b' + mName + '\\b').test(target)) {
      month = mVal;
      break;
    }
  }

  return year * 100 + month;
}

/**
 * Calculates a composite score for an item with both end date and start date.
 * Primary: End date / ongoing status (most recent completed or active first).
 * Secondary: Start date (newer start date ranks higher when end dates match).
 */
export function getItemDateScore(
  endDateStr?: string,
  startDateStr?: string,
  isOngoing?: boolean
): number {
  const endScore = parseDateToScore(endDateStr, isOngoing);
  const startScore = parseDateToScore(startDateStr, false);
  return endScore * 1000000 + startScore;
}

/**
 * Sorts any array of items with date fields in descending chronological order (most recent first).
 */
export function sortDescByDate<T>(
  items: T[],
  getDateScore: (item: T) => number
): T[] {
  return [...items].sort((a, b) => getDateScore(b) - getDateScore(a));
}
