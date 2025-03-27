
import React, { useState, useRef } from "react";
import { PersonData, ActivityData } from "../types";
import { isTimeSlotOccupied } from "./CourtStyleUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { HorizontalTimeNav } from "./HorizontalTimeNav";
import { useToast } from "@/hooks/use-toast";
import { TimelineLabels } from "./TimelineLabels";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { CourtHeader } from "./CourtHeader";

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
  onRemoveActivity
}: CourtScheduleViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeHour, setActiveHour] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<Record<string, string[]>>({});
  const isMobile = useIsMobile();
  const { toast } = useToast();

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

  // Scroll to a specific hour
  const scrollToHour = (hour: string) => {
    if (scrollContainerRef.current) {
      const matchingSlots = timeSlots.filter(slot => slot.startsWith(hour));
      if (matchingSlots.length > 0) {
        const firstSlot = matchingSlots[0];
        const slotIndex = timeSlots.indexOf(firstSlot);
        
        const timeSlotElements = scrollContainerRef.current.querySelectorAll('.border-b');
        if (timeSlotElements[slotIndex]) {
          timeSlotElements[slotIndex].scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setActiveHour(hour);
  };

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      {/* Court header with metadata and validation controls */}
      <CourtHeader 
        courtName={courtName}
        courtNumber={courtNumber}
        courtType={courtType}
        occupants={occupants}
        onValidate={detectCoachConflicts}
      />
      
      {/* Time navigation - sticky at the top of scroll area */}
      <div className="sticky top-[60px] bg-white bg-opacity-95 z-20 border-b border-gray-200 shadow-sm py-2 px-2">
        <HorizontalTimeNav 
          timeSlots={timeSlots}
          activeHour={activeHour}
          onHourSelect={scrollToHour}
        />
      </div>
      
      <div className="flex flex-1 relative">
        {/* Time labels column */}
        <TimelineLabels timeSlots={timeSlots} />

        {/* Time slots grid */}
        <TimeSlotGrid
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
        />
      </div>
    </div>
  );
}
