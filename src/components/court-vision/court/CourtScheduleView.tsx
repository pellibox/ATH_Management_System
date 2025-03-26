import React, { useRef, useState } from "react";
import { TimeSlot } from "../time-slot/TimeSlot";
import { PersonData, ActivityData } from "../types";
import { isTimeSlotOccupied } from "./CourtStyleUtils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CourtScheduleViewProps {
  courtId: string;
  courtName: string;
  courtNumber: number;
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

  const scrollToTimeSlot = (index: number) => {
    if (scrollContainerRef.current && index >= 0 && index < timeSlots.length) {
      const timeSlotElements = scrollContainerRef.current.querySelectorAll('.border-b.border-gray-200');
      if (timeSlotElements[index]) {
        timeSlotElements[index].scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getUniqueHours = (slots: string[]) => {
    const uniqueHours = new Set(slots.map(slot => slot.split(':')[0]));
    return Array.from(uniqueHours);
  };

  const handleHourNavigation = (hour: string) => {
    const targetIndex = timeSlots.findIndex(slot => slot.startsWith(hour));
    if (targetIndex !== -1) {
      scrollToTimeSlot(targetIndex);
      setActiveHour(hour);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      <div className="flex flex-1 relative">
        {/* Time labels column - always visible */}
        <div className="w-16 z-20 flex flex-col">
          {timeSlots.map((time) => (
            <div key={`time-label-${time}`} className="h-[90px] flex items-center">
              <div className="bg-white px-1.5 py-1 text-xs font-semibold rounded shadow-sm">
                {time}
              </div>
            </div>
          ))}
        </div>

        <div 
          ref={scrollContainerRef} 
          className="flex-1 overflow-auto h-full relative ml-2 position-relative"
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
        
        {/* Court-specific Time Navigation */}
        <div className="absolute right-2 top-1/4 bottom-1/4 w-10 z-30">
          <div className="sticky top-1/2 transform -translate-y-1/2 bg-white/95 border border-gray-200 rounded-lg shadow-md flex flex-col overflow-visible">
            {getUniqueHours(timeSlots).map((hour) => (
              <button
                key={`nav-${hour}`}
                onClick={() => handleHourNavigation(hour)}
                className={`w-full text-xs py-1 hover:bg-gray-100 text-gray-700 font-medium 
                  ${activeHour === hour ? 'bg-gray-200' : ''}`}
              >
                {hour}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
