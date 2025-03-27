
import React, { forwardRef, useEffect, useRef } from "react";
import { TimeSlot } from "../time-slot/TimeSlot";
import { PersonData, ActivityData } from "../types";

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
  
  // Scroll to active hour when it changes, but only scroll the slots inside the container
  useEffect(() => {
    if (activeHour && containerRef.current) {
      const matchingSlots = uniqueTimeSlots.filter(slot => slot.startsWith(activeHour));
      if (matchingSlots.length > 0) {
        const firstSlot = matchingSlots[0];
        const slotIndex = uniqueTimeSlots.indexOf(firstSlot);
        
        const timeSlotElements = containerRef.current.querySelectorAll('.border-b');
        if (timeSlotElements[slotIndex]) {
          // Smooth scroll within the container instead of using scrollIntoView
          const slotElement = timeSlotElements[slotIndex] as HTMLElement;
          const containerTop = containerRef.current.scrollTop;
          const slotTop = slotElement.offsetTop;
          
          containerRef.current.scrollTo({
            top: slotTop,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [activeHour, uniqueTimeSlots]);
  
  return (
    <div 
      ref={ref}
      className="overflow-auto flex-1 h-full relative"
    >
      <div ref={containerRef} className="min-h-full pb-16">
        {uniqueTimeSlots.map((time, index) => {
          const hasConflicts = conflicts[time] && conflicts[time].length > 0;
          // Determine if this time slot starts a new hour
          const isHourStart = index === 0 || uniqueTimeSlots[index-1].split(':')[0] !== time.split(':')[0];
          
          return (
            <TimeSlot
              key={`${courtId}-${time}`}
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
            />
          );
        })}
      </div>
    </div>
  );
});

TimeSlotGrid.displayName = "TimeSlotGrid";
