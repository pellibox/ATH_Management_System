
import React, { useState, useRef, useEffect } from "react";
import { PersonData, ActivityData } from "../types";
import { isTimeSlotOccupied } from "./CourtStyleUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { TimelineLabels } from "./TimelineLabels";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { CourtHeader } from "./CourtHeader";
import { toast } from "@/hooks/use-toast";

interface CourtScheduleViewProps {
  courtId: string;
  courtName: string;
  courtNumber: number;
  courtType: string;
  timeSlots: string[];
  occupants: PersonData[];
  activities: ActivityData[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  activeHour?: string | null;
}

export function CourtScheduleView({
  courtId,
  courtName,
  courtNumber,
  courtType,
  timeSlots,
  occupants,
  activities,
  onDrop,
  onActivityDrop,
  onRemovePerson,
  onRemoveActivity,
  activeHour
}: CourtScheduleViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [conflicts, setConflicts] = useState<Record<string, string[]>>({});
  const isMobile = useIsMobile();
  
  // Find coach conflicts (same coach assigned to multiple courts at the same time)
  const detectCoachConflicts = () => {
    const newConflicts: Record<string, string[]> = {};
    
    // Group occupants by time slot
    timeSlots.forEach(slot => {
      const coachesInSlot: Record<string, string[]> = {};
      
      // Check all courts for coaches in this time slot
      occupants.forEach(person => {
        if (person.type === "coach" && isTimeSlotOccupied(person, slot, timeSlots)) {
          if (!coachesInSlot[person.id]) {
            coachesInSlot[person.id] = [];
          }
          coachesInSlot[person.id].push(courtId);
        }
      });
      
      // Find coaches assigned to multiple courts
      Object.entries(coachesInSlot).forEach(([coachId, courts]) => {
        if (courts.length > 1) {
          newConflicts[slot] = [...(newConflicts[slot] || []), coachId];
        }
      });
    });
    
    setConflicts(newConflicts);
    
    // Show toast for conflicts
    const conflictCount = Object.values(newConflicts).flat().length;
    if (conflictCount > 0) {
      toast({
        title: "Rilevati conflitti",
        description: `${conflictCount} conflitti rilevati nell'assegnazione degli orari`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Validazione completata",
        description: "Nessun conflitto rilevato",
        variant: "default"
      });
    }
  };

  const getOccupantsForTimeSlot = (time: string) => {
    return occupants.filter(person => 
      isTimeSlotOccupied(person, time, timeSlots) || 
      (person.timeSlot === time) || 
      (!person.timeSlot && time === timeSlots[0])
    );
  };

  const getActivitiesForTimeSlot = (time: string) => {
    return activities.filter(activity => 
      isTimeSlotOccupied(activity, time, timeSlots) ||
      (activity.startTime === time) || 
      (!activity.startTime && time === timeSlots[0])
    );
  };

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      <div className="flex flex-1 relative">
        {/* Time labels column */}
        <TimelineLabels timeSlots={timeSlots} />

        {/* Time slots grid */}
        <TimeSlotGrid
          ref={scrollContainerRef}
          courtId={courtId}
          timeSlots={timeSlots}
          occupants={occupants}
          activities={activities}
          conflicts={conflicts}
          onDrop={onDrop}
          onActivityDrop={onActivityDrop}
          onRemovePerson={onRemovePerson}
          onRemoveActivity={onRemoveActivity}
          getOccupantsForTimeSlot={getOccupantsForTimeSlot}
          getActivitiesForTimeSlot={getActivitiesForTimeSlot}
          activeHour={activeHour}
        />
      </div>
    </div>
  );
}
