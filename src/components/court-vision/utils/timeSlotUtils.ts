/**
 * Utility functions for working with time slots
 */

// Cache per le funzioni più usate
const timeSlotCache = new Map();

/**
 * Formats a time slot for display
 */
export function formatTimeSlot(timeSlot: string): string {
  // Semplice caching per migliorare le performance
  const cacheKey = `format_${timeSlot}`;
  if (timeSlotCache.has(cacheKey)) {
    return timeSlotCache.get(cacheKey);
  }
  
  const result = timeSlot;
  timeSlotCache.set(cacheKey, result);
  return result;
}

/**
 * Returns the hour portion of a time slot
 */
export function getHourFromTimeSlot(timeSlot: string): string {
  const cacheKey = `hour_${timeSlot}`;
  if (timeSlotCache.has(cacheKey)) {
    return timeSlotCache.get(cacheKey);
  }
  
  const result = timeSlot.split(':')[0];
  timeSlotCache.set(cacheKey, result);
  return result;
}

/**
 * Determines if two time slots are in the same hour
 */
export function isSameHour(timeSlot1: string, timeSlot2: string): boolean {
  const cacheKey = `same_${timeSlot1}_${timeSlot2}`;
  if (timeSlotCache.has(cacheKey)) {
    return timeSlotCache.get(cacheKey);
  }
  
  const result = getHourFromTimeSlot(timeSlot1) === getHourFromTimeSlot(timeSlot2);
  timeSlotCache.set(cacheKey, result);
  return result;
}

/**
 * Categorizes a time slot as morning, afternoon, or evening
 */
export function categorizeTimeSlot(timeSlot: string): 'morning' | 'afternoon' | 'evening' {
  const hour = parseInt(getHourFromTimeSlot(timeSlot));
  
  if (hour < 12) {
    return 'morning';
  } else if (hour < 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

/**
 * Gets a representative time slot for a category
 */
export function getRepresentativeTimeForCategory(
  category: 'morning' | 'afternoon' | 'evening',
  timeSlots: string[]
): string | null {
  // Filter time slots by category
  const filteredSlots = timeSlots.filter(slot => {
    const hour = parseInt(getHourFromTimeSlot(slot));
    
    if (category === 'morning' && hour < 12) {
      return true;
    } else if (category === 'afternoon' && hour >= 12 && hour < 17) {
      return true;
    } else if (category === 'evening' && hour >= 17) {
      return true;
    }
    
    return false;
  });
  
  // Return the first matching slot, or null if none
  return filteredSlots.length > 0 ? filteredSlots[0] : null;
}

/**
 * Calculates the duration between two time slots in hours
 */
export function calculateDurationBetweenTimeSlots(startSlot: string, endSlot: string, allSlots: string[]): number {
  const cacheKey = `duration_${startSlot}_${endSlot}_${allSlots.length}`;
  if (timeSlotCache.has(cacheKey)) {
    return timeSlotCache.get(cacheKey);
  }
  
  const startIndex = allSlots.indexOf(startSlot);
  const endIndex = allSlots.indexOf(endSlot);
  
  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    return 0;
  }
  
  // Each slot typically represents 30 minutes
  const result = (endIndex - startIndex + 1) * 0.5;
  timeSlotCache.set(cacheKey, result);
  return result;
}

/**
 * Gets the next time slot from the provided list
 */
export function getNextTimeSlot(currentSlot: string, allSlots: string[]): string | null {
  const cacheKey = `next_${currentSlot}_${allSlots.length}`;
  if (timeSlotCache.has(cacheKey)) {
    return timeSlotCache.get(cacheKey);
  }
  
  const currentIndex = allSlots.indexOf(currentSlot);
  
  if (currentIndex === -1 || currentIndex === allSlots.length - 1) {
    const result = null;
    timeSlotCache.set(cacheKey, result);
    return result;
  }
  
  const result = allSlots[currentIndex + 1];
  timeSlotCache.set(cacheKey, result);
  return result;
}

/**
 * Gets a time slot at a specific offset from the current one
 */
export function getTimeSlotWithOffset(currentSlot: string, offsetSlots: number, allSlots: string[]): string | null {
  const cacheKey = `offset_${currentSlot}_${offsetSlots}_${allSlots.length}`;
  if (timeSlotCache.has(cacheKey)) {
    return timeSlotCache.get(cacheKey);
  }
  
  const currentIndex = allSlots.indexOf(currentSlot);
  
  if (currentIndex === -1) {
    const result = null;
    timeSlotCache.set(cacheKey, result);
    return result;
  }
  
  const targetIndex = currentIndex + offsetSlots;
  
  if (targetIndex < 0 || targetIndex >= allSlots.length) {
    const result = null;
    timeSlotCache.set(cacheKey, result);
    return result;
  }
  
  const result = allSlots[targetIndex];
  timeSlotCache.set(cacheKey, result);
  return result;
}

/**
 * Calculates end time slot based on start and duration
 */
export function calculateEndTimeSlot(startSlot: string, durationHours: number, allSlots: string[]): string | null {
  const cacheKey = `end_${startSlot}_${durationHours}_${allSlots.length}`;
  if (timeSlotCache.has(cacheKey)) {
    return timeSlotCache.get(cacheKey);
  }
  
  const startIndex = allSlots.indexOf(startSlot);
  
  if (startIndex === -1) {
    const result = null;
    timeSlotCache.set(cacheKey, result);
    return result;
  }
  
  // Calculate how many slots needed (2 slots per hour)
  const slotsNeeded = Math.ceil(durationHours * 2) - 1;
  const endIndex = startIndex + slotsNeeded;
  
  if (endIndex >= allSlots.length) {
    const result = allSlots[allSlots.length - 1];
    timeSlotCache.set(cacheKey, result);
    return result;
  }
  
  const result = allSlots[endIndex];
  timeSlotCache.set(cacheKey, result);
  return result;
}

// Aggiunge una funzione per pulire la cache se necessario
export function clearTimeSlotCache(): void {
  timeSlotCache.clear();
}
