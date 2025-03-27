
import React, { forwardRef, useEffect, useRef, useCallback } from "react";
import { TimeSlot } from "../time-slot/TimeSlot";
import { PersonData, ActivityData } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";

interface TimeSlotGridProps {
  courtId: string;
  timeSlots: string[];
  occupants: PersonData[];
  activities: ActivityData[];
  conflicts: Record<string, string[]>;
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  getOccupantsForTimeSlot: (time: string) => PersonData[];
  getActivitiesForTimeSlot: (time: string) => ActivityData[];
  activeHour?: string | null;
}

// Use forwardRef to properly pass the ref from parent component
export const TimeSlotGrid = forwardRef<HTMLDivElement, TimeSlotGridProps>(({ 
  courtId,
  timeSlots,
  occupants,
  activities,
  conflicts,
  onDrop,
  onActivityDrop,
  onRemovePerson,
  onRemoveActivity,
  getOccupantsForTimeSlot,
  getActivitiesForTimeSlot,
  activeHour
}, ref) => {
  // Create a set of unique hour values to prevent duplication
  const uniqueTimeSlots = [...new Set(timeSlots)];
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const isMobile = useIsMobile();
  
  // Function to scroll to a specific hour
  const scrollToHour = useCallback((hour: string | null) => {
    if (!hour || !containerRef.current) return;
    
    // Find matching time slots
    const matchingSlots = uniqueTimeSlots.filter(slot => slot.startsWith(hour));
    if (matchingSlots.length === 0) return;
    
    const firstSlot = matchingSlots[0];
    const slotIndex = uniqueTimeSlots.indexOf(firstSlot);
    if (slotIndex === -1) return;
    
    const timeSlotElements = containerRef.current.querySelectorAll('.time-slot-container');
    if (!timeSlotElements[slotIndex]) return;
    
    // Get the slot element and calculate scroll position
    const slotElement = timeSlotElements[slotIndex] as HTMLElement;
    const slotTop = slotElement.offsetTop;
    
    // Apply throttling to prevent too many scrolls
    const now = Date.now();
    if (now - lastScrollTimeRef.current < 100) {
      // Too soon since last scroll, let's debounce
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        containerRef.current?.scrollTo({
          top: slotTop,
          behavior: 'smooth'
        });
        lastScrollTimeRef.current = now;
      }, 100);
      
      return;
    }
    
    // Perform the scroll
    containerRef.current.scrollTo({
      top: slotTop,
      behavior: 'smooth'
    });
    
    lastScrollTimeRef.current = now;
  }, [uniqueTimeSlots]);
  
  // Scroll to active hour when it changes
  useEffect(() => {
    scrollToHour(activeHour);
  }, [activeHour, scrollToHour]);
  
  // Save scroll position when unmounting
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  // Implement the virtualization for performance
  const getVisibleSlots = () => {
    // For now, we'll return all slots
    // In a future optimization, this could implement windowing/virtualization
    return uniqueTimeSlots;
  };
  
  const visibleTimeSlots = getVisibleSlots();
  
  return (
    <div 
      ref={ref}
      className="overflow-auto flex-1 h-full relative"
    >
      <div ref={containerRef} className="min-h-full pb-16">
        {visibleTimeSlots.map((time, index) => {
          const hasConflicts = conflicts[time] && conflicts[time].length > 0;
          // Determine if this time slot starts a new hour
          const isHourStart = index === 0 || uniqueTimeSlots[index-1].split(':')[0] !== time.split(':')[0];
          
          return (
            <div 
              key={`${courtId}-${time}`}
              className="time-slot-container"
              id={`time-slot-${courtId}-${time.replace(':', '-')}`}
            >
              <TimeSlot
                courtId={courtId}
                time={time}
                occupants={getOccupantsForTimeSlot(time)}
                activities={getActivitiesForTimeSlot(time)}
                onDrop={onDrop}
                onActivityDrop={onActivityDrop}
                onRemovePerson={onRemovePerson}
                onRemoveActivity={onRemoveActivity}
                hasConflicts={hasConflicts}
                isHourStart={isHourStart}
                conflicts={conflicts}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

TimeSlotGrid.displayName = "TimeSlotGrid";
