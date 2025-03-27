
import React, { useRef } from "react";
import { PersonData, ActivityData } from "../types";
import { TimeSlotOccupants } from "./TimeSlotOccupants";
import { TimeSlotActivities } from "./TimeSlotActivities";
import { TimeSlotDropArea } from "./TimeSlotDropArea";
import { AlertTriangle, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  isHourStart?: boolean;
  conflicts?: Record<string, string[]>;
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
  hasConflicts = false,
  isHourStart = false,
  conflicts = {}
}: TimeSlotProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Calculate if this is a primary time slot (where an assignment starts)
  const hasPrimaryAssignments = occupants.some(p => p.timeSlot === time) || 
                               activities.some(a => a.startTime === time);
  
  // Count confirmed vs unconfirmed assignments
  const confirmedAssignments = occupants.filter(p => p.status === "confirmed").length + 
                              activities.filter(a => a.status === "confirmed").length;
                              
  const pendingAssignments = occupants.filter(p => p.status === "pending").length + 
                            activities.filter(a => a.status === "pending").length;
                            
  const totalAssignments = occupants.length + activities.length;
  
  // Determine background color based on state and confirmation status
  let bgColor = "";
  let borderStyle = "";
  
  if (hasConflicts) {
    bgColor = "bg-orange-50"; 
    borderStyle = "animate-pulse-border border-orange-400";
  } else if (hasPrimaryAssignments) {
    if (pendingAssignments > 0 && totalAssignments === pendingAssignments) {
      // All assignments are pending
      bgColor = "bg-stripes-primary";
    } else if (confirmedAssignments > 0 && totalAssignments === confirmedAssignments) {
      // All assignments are confirmed
      bgColor = "bg-green-50/50";
    } else {
      // Mixed status
      bgColor = "bg-blue-50/20";
    }
  } else if (occupants.length > 0 || activities.length > 0) {
    // Continuation slots in very light background
    bgColor = "bg-blue-50/10"; 
  }

  const slotHeight = isMobile ? 'h-[90px]' : 'h-[110px]';

  return (
    <div 
      className={`relative flex border-b ${
        isHourStart ? 'border-gray-300' : 'border-gray-100'
      } py-1 ${slotHeight} ${bgColor} ${borderStyle} transition-colors duration-200 ${
        isHourStart ? 'border-t-2 border-t-gray-300' : ''
      }`}
    >
      {hasConflicts && (
        <div className="absolute right-2 top-1 z-30">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
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
              conflicts={conflicts}
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
