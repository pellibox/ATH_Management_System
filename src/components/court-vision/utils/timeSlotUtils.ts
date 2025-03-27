
/**
 * Utility functions for working with time slots
 */

/**
 * Formats a time slot for display
 */
export function formatTimeSlot(timeSlot: string): string {
  return timeSlot;
}

/**
 * Returns the hour portion of a time slot
 */
export function getHourFromTimeSlot(timeSlot: string): string {
  return timeSlot.split(':')[0];
}

/**
 * Determines if two time slots are in the same hour
 */
export function isSameHour(timeSlot1: string, timeSlot2: string): boolean {
  return getHourFromTimeSlot(timeSlot1) === getHourFromTimeSlot(timeSlot2);
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
  const startIndex = allSlots.indexOf(startSlot);
  const endIndex = allSlots.indexOf(endSlot);
  
  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    return 0;
  }
  
  // Each slot typically represents 30 minutes
  return (endIndex - startIndex + 1) * 0.5;
}

/**
 * Gets the next time slot from the provided list
 */
export function getNextTimeSlot(currentSlot: string, allSlots: string[]): string | null {
  const currentIndex = allSlots.indexOf(currentSlot);
  
  if (currentIndex === -1 || currentIndex === allSlots.length - 1) {
    return null;
  }
  
  return allSlots[currentIndex + 1];
}

/**
 * Gets a time slot at a specific offset from the current one
 */
export function getTimeSlotWithOffset(currentSlot: string, offsetSlots: number, allSlots: string[]): string | null {
  const currentIndex = allSlots.indexOf(currentSlot);
  
  if (currentIndex === -1) {
    return null;
  }
  
  const targetIndex = currentIndex + offsetSlots;
  
  if (targetIndex < 0 || targetIndex >= allSlots.length) {
    return null;
  }
  
  return allSlots[targetIndex];
}

/**
 * Calculates end time slot based on start and duration
 */
export function calculateEndTimeSlot(startSlot: string, durationHours: number, allSlots: string[]): string | null {
  const startIndex = allSlots.indexOf(startSlot);
  
  if (startIndex === -1) {
    return null;
  }
  
  // Calculate how many slots needed (2 slots per hour)
  const slotsNeeded = Math.ceil(durationHours * 2) - 1;
  const endIndex = startIndex + slotsNeeded;
  
  if (endIndex >= allSlots.length) {
    return allSlots[allSlots.length - 1];
  }
  
  return allSlots[endIndex];
}
