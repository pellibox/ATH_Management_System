
import React, { useRef, useState, useEffect } from "react";
import { TimeSlot } from "../time-slot/TimeSlot";
import { PersonData, ActivityData } from "../types";
import { isTimeSlotOccupied } from "./CourtStyleUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { HorizontalTimeNav } from "./HorizontalTimeNav";

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

  // Update scroll position to position time nav
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setScrollTop(scrollContainerRef.current.scrollTop);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Get all unique hours from the time slots
  const getUniqueHours = () => {
    return [...new Set(timeSlots.map(slot => slot.split(':')[0]))];
  };

  // Get compact representation of time ranges
  const getCompactTimeRanges = () => {
    const hours = getUniqueHours().map(h => parseInt(h));
    return hours.map((hour, index) => {
      if (index % 2 === 0 && index < hours.length - 1) {
        return `${hour}-${hours[index + 1]}`;
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      {/* Court name header with improved styling */}
      <div className="py-3 px-4 bg-white bg-opacity-95 z-30 border-b border-gray-200 text-center shadow-sm">
        <h3 className="font-bold text-xl text-gray-800">
          {courtName} #{courtNumber} - {getCourtLabel(courtType)}
        </h3>
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
          {/* Floating time navigation that follows scroll */}
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
