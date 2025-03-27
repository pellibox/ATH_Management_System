
/**
 * Time slot calculation utilities
 */

import { getCachedValue, setCachedValue, hasCachedValue } from './timeSlotCache';

/**
 * Gets a representative time slot for a category
 */
export function getRepresentativeTimeForCategory(
  category: 'morning' | 'afternoon' | 'evening',
  timeSlots: string[]
): string | null {
  const cacheKey = `rep_time_${category}_${timeSlots.length}`;
  if (hasCachedValue(cacheKey)) {
    return getCachedValue<string | null>(cacheKey);
  }
  
  // Import locally to avoid circular dependencies
  import('./timeSlotFormat').then(({ categorizeTimeSlot }) => {
    // Filter time slots by category
    const filteredSlots = timeSlots.filter(slot => {
      const slotCategory = categorizeTimeSlot(slot);
      return slotCategory === category;
    });
    
    // Return the first matching slot, or null if none
    const result = filteredSlots.length > 0 ? filteredSlots[0] : null;
    setCachedValue(cacheKey, result);
  });
  
  // Until the async import resolves, return from cache or null
  return getCachedValue<string | null>(cacheKey) || null;
}

/**
 * Calculates the duration between two time slots in hours
 */
export function calculateDurationBetweenTimeSlots(startSlot: string, endSlot: string, allSlots: string[]): number {
  const cacheKey = `duration_${startSlot}_${endSlot}_${allSlots.length}`;
  if (hasCachedValue(cacheKey)) {
    return getCachedValue<number>(cacheKey)!;
  }
  
  const startIndex = allSlots.indexOf(startSlot);
  const endIndex = allSlots.indexOf(endSlot);
  
  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    return 0;
  }
  
  // Each slot typically represents 30 minutes
  const result = (endIndex - startIndex + 1) * 0.5;
  setCachedValue(cacheKey, result);
  return result;
}

/**
 * Calculates end time slot based on start and duration
 */
export function calculateEndTimeSlot(startSlot: string, durationHours: number, allSlots: string[]): string | null {
  const cacheKey = `end_${startSlot}_${durationHours}_${allSlots.length}`;
  if (hasCachedValue(cacheKey)) {
    return getCachedValue<string | null>(cacheKey);
  }
  
  const startIndex = allSlots.indexOf(startSlot);
  
  if (startIndex === -1) {
    const result = null;
    setCachedValue(cacheKey, result);
    return result;
  }
  
  // Calculate how many slots needed (2 slots per hour)
  const slotsNeeded = Math.ceil(durationHours * 2) - 1;
  const endIndex = startIndex + slotsNeeded;
  
  if (endIndex >= allSlots.length) {
    const result = allSlots[allSlots.length - 1];
    setCachedValue(cacheKey, result);
    return result;
  }
  
  const result = allSlots[endIndex];
  setCachedValue(cacheKey, result);
  return result;
}
