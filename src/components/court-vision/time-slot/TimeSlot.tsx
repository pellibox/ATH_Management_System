
import React, { useRef } from "react";
import { PersonData, ActivityData } from "../types";
import { TimeSlotOccupants } from "./TimeSlotOccupants";
import { TimeSlotActivities } from "./TimeSlotActivities";
import { TimeSlotDropArea } from "./TimeSlotDropArea";
import { AlertTriangle } from "lucide-react";

interface TimeSlotProps {
  courtId: string;
  time: string;
  occupants: PersonData[];
  activities: ActivityData[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, time?: string) => void;
  onRemoveActivity: (activityId: string, time?: string) => void;
  hasConflicts?: boolean;
}

export function TimeSlot({ 
  courtId, 
  time, 
  occupants, 
  activities, 
  onDrop, 
  onActivityDrop, 
  onRemovePerson, 
  onRemoveActivity,
  hasConflicts = false
}: TimeSlotProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate if this is a primary time slot (where an assignment starts)
  const hasPrimaryAssignments = occupants.some(p => p.timeSlot === time) || 
                               activities.some(a => a.startTime === time);

  return (
    <div className={`relative flex border-b border-gray-200 py-0.5 h-[90px] ${
      hasConflicts ? 'bg-red-50' : (hasPrimaryAssignments ? 'bg-blue-50/30' : '')
    }`}>
      {hasConflicts && (
        <div className="absolute right-2 top-1 z-30">
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </div>
      )}
      
      <div className="flex-1 px-1 relative">
        <div className="relative h-full">
          <div 
            ref={scrollContainerRef} 
            className="h-full overflow-auto relative flex items-center"
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
