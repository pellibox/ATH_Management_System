
import React, { useRef } from "react";
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
}

export function TimeSlotGrid({ 
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
  getActivitiesForTimeSlot
}: TimeSlotGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={scrollContainerRef} 
      className="overflow-auto flex-1 h-full relative"
    >
      <div className="min-h-full pb-16">
        {timeSlots.map((time, index) => {
          const hasConflicts = conflicts[time] && conflicts[time].length > 0;
          // Determine if this time slot starts a new hour
          const isHourStart = index === 0 || timeSlots[index-1].split(':')[0] !== time.split(':')[0];
          
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
}
