import type { CloudTheme } from '../types';

/**
 * Determines the atmospheric theme based on the viewer's current local timezone / time of day.
 * - Sunrise (Dawn & Golden Hour): 05:00 - 08:59 and 17:00 - 19:59
 * - Daylight (Bright Sun & Clear Sky): 09:00 - 16:59
 * - Night (Starry Sky & Illuminated Monuments): 20:00 - 04:59
 */
export function getTimezoneBasedTheme(): CloudTheme {
  const hour = new Date().getHours();

  if ((hour >= 5 && hour < 9) || (hour >= 17 && hour < 20)) {
    return 'sunrise';
  } else if (hour >= 9 && hour < 17) {
    return 'daylight';
  } else {
    return 'night';
  }
}

/**
 * Returns a descriptive label for the detected timezone period.
 */
export function getTimezonePeriodLabel(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return 'Sunrise / Dawn';
  if (hour >= 9 && hour < 17) return 'Daylight';
  if (hour >= 17 && hour < 20) return 'Sunset / Golden Hour';
  return 'Night';
}
