
/**
 * Time slot navigation utilities
 */

import { getCachedValue, setCachedValue, hasCachedValue } from './timeSlotCache';

/**
 * Gets the next time slot from the provided list
 */
export function getNextTimeSlot(currentSlot: string, allSlots: string[]): string | null {
  const cacheKey = `next_${currentSlot}_${allSlots.length}`;
  if (hasCachedValue(cacheKey)) {
    return getCachedValue<string | null>(cacheKey);
  }
  
  const currentIndex = allSlots.indexOf(currentSlot);
  
  if (currentIndex === -1 || currentIndex === allSlots.length - 1) {
    const result = null;
    setCachedValue(cacheKey, result);
    return result;
  }
  
  const result = allSlots[currentIndex + 1];
  setCachedValue(cacheKey, result);
  return result;
}

/**
 * Gets a time slot at a specific offset from the current one
 */
export function getTimeSlotWithOffset(currentSlot: string, offsetSlots: number, allSlots: string[]): string | null {
  const cacheKey = `offset_${currentSlot}_${offsetSlots}_${allSlots.length}`;
  if (hasCachedValue(cacheKey)) {
    return getCachedValue<string | null>(cacheKey);
  }
  
  const currentIndex = allSlots.indexOf(currentSlot);
  
  if (currentIndex === -1) {
    const result = null;
    setCachedValue(cacheKey, result);
    return result;
  }
  
  const targetIndex = currentIndex + offsetSlots;
  
  if (targetIndex < 0 || targetIndex >= allSlots.length) {
    const result = null;
    setCachedValue(cacheKey, result);
    return result;
  }
  
  const result = allSlots[targetIndex];
  setCachedValue(cacheKey, result);
  return result;
}
