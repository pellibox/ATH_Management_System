
import React, { useRef, useState, useEffect } from "react";
import { TimeSlot } from "../time-slot/TimeSlot";
import { PersonData, ActivityData } from "../types";
import { isTimeSlotOccupied } from "./CourtStyleUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { HorizontalTimeNav } from "./HorizontalTimeNav";
import { Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
  const [scrollTop, setScrollTop] = useState(0);
  const [validationInProgress, setValidationInProgress] = useState(false);
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

  // Calculate total daily hours for a player
  const getPlayerDailyHours = (playerId: string): number => {
    return occupants
      .filter(p => p.id === playerId && p.type === "player")
      .reduce((total, p) => total + (p.durationHours || 1), 0);
  };
  
  // Calculate remaining daily hours based on program limit
  const getRemainingHours = (playerId: string): number => {
    const player = occupants.find(p => p.id === playerId);
    const programLimit = player?.programId ? 4 : 2; // Example limit based on program
    const usedHours = getPlayerDailyHours(playerId);
    return Math.max(0, programLimit - usedHours);
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
    }
  };
  
  // Simulate delayed validation (5 seconds after changes)
  useEffect(() => {
    let validationTimer: NodeJS.Timeout;
    
    if (occupants.length > 0) {
      setValidationInProgress(true);
      validationTimer = setTimeout(() => {
        detectCoachConflicts();
        setValidationInProgress(false);
      }, 5000);
    }
    
    return () => {
      if (validationTimer) clearTimeout(validationTimer);
    };
  }, [occupants]);

  // Scroll to a specific hour
  const scrollToHour = (hour: string) => {
    if (scrollContainerRef.current) {
      const matchingSlots = timeSlots.filter(slot => slot.startsWith(hour));
      if (matchingSlots.length > 0) {
        const firstSlot = matchingSlots[0];
        const slotIndex = timeSlots.indexOf(firstSlot);
        
        const timeSlotElements = scrollContainerRef.current.querySelectorAll('.border-b.border-gray-200');
        if (timeSlotElements[slotIndex]) {
          timeSlotElements[slotIndex].scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setActiveHour(hour);
  };

  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setScrollTop(scrollContainerRef.current.scrollTop);
        
        // Determine current visible hour based on scroll position
        const timeSlotElements = scrollContainerRef.current.querySelectorAll('.border-b.border-gray-200');
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        
        for (let i = 0; i < timeSlotElements.length; i++) {
          const elementRect = timeSlotElements[i].getBoundingClientRect();
          if (elementRect.top >= containerRect.top) {
            const timeSlot = timeSlots[i];
            if (timeSlot) {
              const hour = timeSlot.split(':')[0];
              if (hour !== activeHour) {
                setActiveHour(hour);
              }
            }
            break;
          }
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [timeSlots, activeHour]);

  // Get all unique hours from the time slots
  const getUniqueHours = () => {
    return [...new Set(timeSlots.map(slot => slot.split(':')[0]))];
  };

  // Force validation immediately
  const handleForceValidation = () => {
    setValidationInProgress(true);
    detectCoachConflicts();
    setValidationInProgress(false);
    
    toast({
      title: "Validazione completata",
      description: "La validazione è stata eseguita con successo"
    });
  };

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      {/* Court name header with improved styling */}
      <div className="py-3 px-4 bg-white bg-opacity-95 z-30 border-b border-gray-200 text-center shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-gray-800">
            {courtName} #{courtNumber}
          </h3>
          
          <div className="flex items-center">
            <Badge variant="outline" className="ml-2 text-xs font-normal">
              {getCourtLabel(courtType)}
            </Badge>
            
            {validationInProgress && (
              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 animate-pulse">
                <Clock className="h-3 w-3 mr-1" />
                Validazione...
              </Badge>
            )}
            
            <button 
              onClick={handleForceValidation}
              className="ml-2 text-xs py-1 px-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Valida ora
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 relative">
        {/* Time labels column - always visible but smaller on mobile */}
        <div className={`${isMobile ? 'w-12' : 'w-16'} z-20 flex flex-col`}>
          {timeSlots.map((time) => (
            <div key={`time-label-${time}`} className={`${isMobile ? 'h-[75px]' : 'h-[90px]'} flex items-center`}>
              <div className={`bg-white ${isMobile ? 'px-1 py-0.5 text-[10px]' : 'px-1.5 py-1 text-xs'} font-semibold rounded shadow-sm`}>
                {time}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 relative ml-1 md:ml-2">
          {/* Sticky time navigation */}
          <div 
            className="sticky top-0 bg-white bg-opacity-95 z-30 border-b border-gray-200 shadow-sm py-2 px-2"
          >
            <HorizontalTimeNav 
              timeSlots={timeSlots}
              activeHour={activeHour}
              onHourSelect={scrollToHour}
            />
          </div>

          <div 
            ref={scrollContainerRef} 
            className="overflow-auto h-full relative"
          >
            <div className="min-h-full pb-16">
              {timeSlots.map((time) => {
                const hasConflicts = conflicts[time] && conflicts[time].length > 0;
                
                return (
                  <TimeSlot
                    key={`${courtId}-${time}`}
                    courtId={courtId}
                    time={time}
                    occupants={getOccupantsForTimeSlot(time)}
                    activities={getActivitiesForTimeSlot(time)}
                    onDrop={onDrop}
                    onActivityDrop={onActivityDrop}
                    onRemovePerson={onRemovePerson || (() => {})}
                    onRemoveActivity={onRemoveActivity || (() => {})}
                    hasConflicts={hasConflicts}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format court type
const getCourtLabel = (courtType: string): string => {
  const type = courtType.split("-");
  if (type.length > 1) {
    return type[1].charAt(0).toUpperCase() + type[1].slice(1);
  }
  return "";
};
