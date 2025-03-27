
/**
 * Main export file for time slot utilities
 */

// Re-export all utility functions from the separate files
export * from './timeSlotCache';
export * from './timeSlotFormat';
export * from './timeSlotCalculations';
export * from './timeSlotNavigation';

// Import functions we need to use directly
import { categorizeTimeSlot } from './timeSlotFormat';
import { preloadCommonValues } from './timeSlotCache';

/**
 * Preload common time slots for performance optimization
 */
export function preloadCommonTimeSlots(slots: string[]): void {
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    
    // Use a dynamic import to avoid circular dependencies
    import('./timeSlotFormat').then(module => {
      module.formatTimeSlot(slot);
      module.getHourFromTimeSlot(slot);
      module.categorizeTimeSlot(slot);
      
      // Preload some common combinations
      if (i < slots.length - 1) {
        const nextSlot = slots[i + 1];
        module.isSameHour(slot, nextSlot);
        
        import('./timeSlotNavigation').then(navModule => {
          navModule.getNextTimeSlot(slot, slots);
        });
        
        import('./timeSlotCalculations').then(calcModule => {
          calcModule.calculateDurationBetweenTimeSlots(slot, nextSlot, slots);
        });
      }
    });
  }
}
