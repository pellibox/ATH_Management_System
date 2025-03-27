
/**
 * Utility functions for working with time slots
 */

// Cache per le funzioni più usate - aumentiamo la dimensione massima della cache
const timeSlotCache = new Map();
const MAX_CACHE_SIZE = 500;

// Funzione per controllare e gestire la dimensione della cache
function manageCacheSize() {
  if (timeSlotCache.size > MAX_CACHE_SIZE) {
    // Se la cache supera la dimensione massima, eliminiamo le entry più vecchie
    const keysToDelete = Array.from(timeSlotCache.keys()).slice(0, Math.floor(MAX_CACHE_SIZE * 0.3));
    keysToDelete.forEach(key => timeSlotCache.delete(key));
  }
}

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
  manageCacheSize();
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
  manageCacheSize();
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
  manageCacheSize();
  return result;
}

/**
 * Categorizes a time slot as morning, afternoon, or evening
 */
export function categorizeTimeSlot(timeSlot: string): 'morning' | 'afternoon' | 'evening' {
  const cacheKey = `category_${timeSlot}`;
  if (timeSlotCache.has(cacheKey)) {
    return timeSlotCache.get(cacheKey);
  }
  
  const hour = parseInt(getHourFromTimeSlot(timeSlot));
  let result;
  
  if (hour < 12) {
    result = 'morning';
  } else if (hour < 17) {
    result = 'afternoon';
  } else {
    result = 'evening';
  }
  
  timeSlotCache.set(cacheKey, result);
  manageCacheSize();
  return result;
}

/**
 * Gets a representative time slot for a category
 */
export function getRepresentativeTimeForCategory(
  category: 'morning' | 'afternoon' | 'evening',
  timeSlots: string[]
): string | null {
  const cacheKey = `rep_time_${category}_${timeSlots.length}`;
  if (timeSlotCache.has(cacheKey)) {
    return timeSlotCache.get(cacheKey);
  }
  
  // Filter time slots by category
  const filteredSlots = timeSlots.filter(slot => {
    const slotCategory = categorizeTimeSlot(slot);
    return slotCategory === category;
  });
  
  // Return the first matching slot, or null if none
  const result = filteredSlots.length > 0 ? filteredSlots[0] : null;
  timeSlotCache.set(cacheKey, result);
  manageCacheSize();
  return result;
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
  manageCacheSize();
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
    manageCacheSize();
    return result;
  }
  
  const result = allSlots[currentIndex + 1];
  timeSlotCache.set(cacheKey, result);
  manageCacheSize();
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
    manageCacheSize();
    return result;
  }
  
  const targetIndex = currentIndex + offsetSlots;
  
  if (targetIndex < 0 || targetIndex >= allSlots.length) {
    const result = null;
    timeSlotCache.set(cacheKey, result);
    manageCacheSize();
    return result;
  }
  
  const result = allSlots[targetIndex];
  timeSlotCache.set(cacheKey, result);
  manageCacheSize();
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
    manageCacheSize();
    return result;
  }
  
  // Calculate how many slots needed (2 slots per hour)
  const slotsNeeded = Math.ceil(durationHours * 2) - 1;
  const endIndex = startIndex + slotsNeeded;
  
  if (endIndex >= allSlots.length) {
    const result = allSlots[allSlots.length - 1];
    timeSlotCache.set(cacheKey, result);
    manageCacheSize();
    return result;
  }
  
  const result = allSlots[endIndex];
  timeSlotCache.set(cacheKey, result);
  manageCacheSize();
  return result;
}

// Aggiunge una funzione per pulire la cache se necessario
export function clearTimeSlotCache(): void {
  timeSlotCache.clear();
}

// Funzione per preallocare cache per time slot comuni
export function preloadCommonTimeSlots(slots: string[]): void {
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    formatTimeSlot(slot);
    getHourFromTimeSlot(slot);
    categorizeTimeSlot(slot);
    
    // Precarica alcune combinazioni comuni
    if (i < slots.length - 1) {
      const nextSlot = slots[i + 1];
      isSameHour(slot, nextSlot);
      getNextTimeSlot(slot, slots);
      calculateDurationBetweenTimeSlots(slot, nextSlot, slots);
    }
  }
}
