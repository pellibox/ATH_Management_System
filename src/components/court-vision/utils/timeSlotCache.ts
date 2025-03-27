/**
 * Cache management for time slot utilities
 */

// Shared cache for time slot operations
const timeSlotCache = new Map();
const MAX_CACHE_SIZE = 500;

/**
 * Ensures the cache stays within the size limits
 * by removing oldest entries when needed
 */
export function manageCacheSize(): void {
  if (timeSlotCache.size > MAX_CACHE_SIZE) {
    // If the cache exceeds the maximum size, delete the oldest entries
    const keysToDelete = Array.from(timeSlotCache.keys()).slice(0, Math.floor(MAX_CACHE_SIZE * 0.3));
    keysToDelete.forEach(key => timeSlotCache.delete(key));
  }
}

/**
 * Get a value from the cache
 */
export function getCachedValue<T>(key: string): T | undefined {
  return timeSlotCache.has(key) ? timeSlotCache.get(key) as T : undefined;
}

/**
 * Set a value in the cache
 */
export function setCachedValue<T>(key: string, value: T): void {
  timeSlotCache.set(key, value);
  manageCacheSize();
}

/**
 * Check if a key exists in the cache
 */
export function hasCachedValue(key: string): boolean {
  return timeSlotCache.has(key);
}

/**
 * Clear the entire time slot cache
 */
export function clearTimeSlotCache(): void {
  timeSlotCache.clear();
}

/**
 * Preload common cache values to improve initial performance
 */
export function preloadCommonValues(timeSlots: string[]): void {
  for (let i = 0; i < timeSlots.length; i++) {
    const slot = timeSlots[i];
    formatTimeSlot(slot);
    getHourFromTimeSlot(slot);
    categorizeTimeSlot(slot);
    
    // Precarica alcune combinazioni comuni
    if (i < timeSlots.length - 1) {
      const nextSlot = timeSlots[i + 1];
      isSameHour(slot, nextSlot);
      getNextTimeSlot(slot, timeSlots);
      calculateDurationBetweenTimeSlots(slot, nextSlot, timeSlots);
    }
  }
}

import { formatTimeSlot, getHourFromTimeSlot, categorizeTimeSlot, isSameHour } from './timeSlotFormat';
import { getNextTimeSlot } from './timeSlotNavigation';
import { calculateDurationBetweenTimeSlots } from './timeSlotCalculations';
