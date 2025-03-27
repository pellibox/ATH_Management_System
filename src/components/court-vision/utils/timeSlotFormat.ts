
/**
 * Time slot formatting and basic conversion utilities
 */

import { getCachedValue, setCachedValue, hasCachedValue } from './timeSlotCache';

/**
 * Formats a time slot for display
 */
export function formatTimeSlot(timeSlot: string): string {
  // Simple caching to improve performance
  const cacheKey = `format_${timeSlot}`;
  if (hasCachedValue(cacheKey)) {
    return getCachedValue<string>(cacheKey)!;
  }
  
  const result = timeSlot;
  setCachedValue(cacheKey, result);
  return result;
}

/**
 * Returns the hour portion of a time slot
 */
export function getHourFromTimeSlot(timeSlot: string): string {
  const cacheKey = `hour_${timeSlot}`;
  if (hasCachedValue(cacheKey)) {
    return getCachedValue<string>(cacheKey)!;
  }
  
  const result = timeSlot.split(':')[0];
  setCachedValue(cacheKey, result);
  return result;
}

/**
 * Determines if two time slots are in the same hour
 */
export function isSameHour(timeSlot1: string, timeSlot2: string): boolean {
  const cacheKey = `same_${timeSlot1}_${timeSlot2}`;
  if (hasCachedValue(cacheKey)) {
    return getCachedValue<boolean>(cacheKey)!;
  }
  
  const result = getHourFromTimeSlot(timeSlot1) === getHourFromTimeSlot(timeSlot2);
  setCachedValue(cacheKey, result);
  return result;
}

/**
 * Categorizes a time slot as morning, afternoon, or evening
 */
export function categorizeTimeSlot(timeSlot: string): 'morning' | 'afternoon' | 'evening' {
  const cacheKey = `category_${timeSlot}`;
  if (hasCachedValue(cacheKey)) {
    return getCachedValue<'morning' | 'afternoon' | 'evening'>(cacheKey)!;
  }
  
  const hour = parseInt(getHourFromTimeSlot(timeSlot));
  let result: 'morning' | 'afternoon' | 'evening';
  
  if (hour < 12) {
    result = 'morning';
  } else if (hour < 17) {
    result = 'afternoon';
  } else {
    result = 'evening';
  }
  
  setCachedValue(cacheKey, result);
  return result;
}
