
import React, { useState, useRef, useEffect } from "react";
import { PersonData, ActivityData } from "../types";
import { isTimeSlotOccupied } from "./CourtStyleUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { TimelineLabels } from "./TimelineLabels";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { CourtHeader } from "./CourtHeader";
import { toast } from "@/hooks/use-toast";
import { useCourtVision } from "../context/CourtVisionContext";
import { useCoachValidation } from "../validation/CoachValidationManager";

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
  const { courts } = useCourtVision();
  const { getCoachConflicts } = useCoachValidation();
  
  // Update conflicts whenever courts change
  useEffect(() => {
    const allConflicts = getCoachConflicts(courts, timeSlots);
    setConflicts(allConflicts[courtId] || {});
  }, [courts, courtId, timeSlots]);
  
  // Find coach conflicts (same coach assigned to multiple courts at the same time)
  const detectCoachConflicts = () => {
    const newConflicts = getCoachConflicts(courts, timeSlots);
    setConflicts(newConflicts[courtId] || {});
    
    // Calculate total conflicts
    const totalConflicts = Object.values(newConflicts).reduce((sum, courtConflicts) => {
      return sum + Object.values(courtConflicts).reduce((innerSum, conflictsArray) => {
        return innerSum + conflictsArray.length;
      }, 0);
    }, 0);
    
    // Show toast with validation results
    if (totalConflicts > 0) {
      toast({
        title: "Rilevati conflitti coach",
        description: `${totalConflicts} conflitti coach rilevati negli orari`,
        variant: "destructive"
      });
      
      return totalConflicts;
    } else {
      toast({
        title: "Validazione completata",
        description: "Nessun conflitto coach rilevato",
        variant: "default"
      });
      
      return 0;
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
