
import React, { useRef } from "react";
import { PersonData, ActivityData } from "../types";
import { TimeSlotOccupants } from "./TimeSlotOccupants";
import { TimeSlotActivities } from "./TimeSlotActivities";
import { TimeSlotDropArea } from "./TimeSlotDropArea";

interface TimeSlotProps {
  courtId: string;
  time: string;
  occupants: PersonData[];
  activities: ActivityData[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, time?: string) => void;
  onRemoveActivity: (activityId: string, time?: string) => void;
}

export function TimeSlot({ 
  courtId, 
  time, 
  occupants, 
  activities, 
  onDrop, 
  onActivityDrop, 
  onRemovePerson, 
  onRemoveActivity 
}: TimeSlotProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex border-b border-gray-200 py-0.5 h-[45px]">
      <div className="flex-1 px-1 relative">
        <div className="relative">
          <div 
            ref={scrollContainerRef} 
            className="max-h-[40px] overflow-auto relative"
          >
            <TimeSlotOccupants 
              occupants={occupants} 
              onRemovePerson={onRemovePerson}
              time={time}
            />
            <TimeSlotActivities 
              activities={activities} 
              onRemoveActivity={onRemoveActivity}
              time={time}
            />
          </div>
        </div>
        
        <TimeSlotDropArea 
          courtId={courtId}
          time={time}
          onDrop={onDrop}
          onActivityDrop={onActivityDrop}
        />
      </div>
    </div>
  );
}
