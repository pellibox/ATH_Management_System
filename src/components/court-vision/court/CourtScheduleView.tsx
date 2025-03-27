
import React, { useRef, useState } from "react";
import { TimeSlot } from "../time-slot/TimeSlot";
import { PersonData, ActivityData } from "../types";
import { isTimeSlotOccupied } from "./CourtStyleUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface CourtScheduleViewProps {
  courtId: string;
  courtName: string;
  courtNumber: number;
  courtType: string;  // Added the missing courtType prop
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
  courtType,  // Added the missing courtType parameter
  timeSlots,
  occupants,
  activities,
  onDrop,
  onActivityDrop,
  onRemovePerson,
  onRemoveActivity
}: CourtScheduleViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeRange, setActiveRange] = useState<string | null>(null);
  const isMobile = useIsMobile();

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

  // Generate time ranges (8-10, 11-13, etc)
  const getTimeRanges = () => {
    if (!timeSlots.length) return [];
    
    const hours = timeSlots.map(slot => parseInt(slot.split(':')[0]));
    const uniqueHours = [...new Set(hours)].sort((a, b) => a - b);
    
    const ranges = [];
    for (let i = 0; i < uniqueHours.length; i += 2) {
      if (i + 1 < uniqueHours.length) {
        ranges.push(`${uniqueHours[i]}-${uniqueHours[i + 1]}`);
      } else {
        // Handle odd number of hours
        ranges.push(`${uniqueHours[i]}-${uniqueHours[i] + 2}`);
      }
    }
    return ranges;
  };

  const scrollToTimeRange = (range: string) => {
    const [start] = range.split('-');
    if (scrollContainerRef.current && start) {
      const startHour = parseInt(start);
      const matchingSlots = timeSlots.filter(slot => parseInt(slot.split(':')[0]) === startHour);
      if (matchingSlots.length > 0) {
        const firstSlot = matchingSlots[0];
        const slotIndex = timeSlots.indexOf(firstSlot);
        
        const timeSlotElements = scrollContainerRef.current.querySelectorAll('.border-b.border-gray-200');
        if (timeSlotElements[slotIndex]) {
          timeSlotElements[slotIndex].scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setActiveRange(range);
  };

  const timeRanges = getTimeRanges();

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      {/* Court name header - more space and prominence */}
      <div className="py-2 px-3 bg-white bg-opacity-90 z-30 border-b border-gray-200 text-center mb-1">
        <h3 className="font-bold text-lg truncate">
          {courtName} #{courtNumber} - {getCourtLabel(courtType)}
        </h3>
      </div>
      
      {/* Floating time navigation - positioned absolutely within the court */}
      <div className="absolute right-2 top-12 z-40">
        <div className="time-nav-floating">
          {timeRanges.map((range) => (
            <button
              key={`range-${range}`}
              className={`time-range-button ${
                activeRange === range ? 'active-time-range' : ''
              }`}
              onClick={() => scrollToTimeRange(range)}
            >
              {range}
            </button>
          ))}
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

        <div 
          ref={scrollContainerRef} 
          className="flex-1 overflow-auto h-full relative ml-1 md:ml-2 position-relative"
        >
          <div className="min-h-full pb-16">
            {timeSlots.map((time) => (
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
              />
            ))}
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
