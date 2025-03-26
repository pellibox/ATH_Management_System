
import React, { useRef } from "react";
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

  return (
    <div className="flex-1 flex flex-col mt-12 mb-1 h-full overflow-hidden relative">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="h-8 border-b border-gray-200 flex items-center px-2">
          <span className="text-xs font-medium">Orari - {courtName} #{courtNumber}</span>
        </div>
      </div>
      
      <div className="flex flex-1 relative">
        <div 
          ref={scrollContainerRef} 
          className="flex-1 overflow-auto h-[calc(100%-2rem)] relative"
        >
          <div className="min-h-full pb-16">
            {timeSlots.map((time) => (
              <TimeSlot
                key={`${courtId}-${time}`}
                courtId={courtId}
                time={time}
                occupants={getOccupantsForTimeSlot(time)}
                activities={getActivitiesForTimeSlot(time)}
                onDrop={(courtId, person, position, timeSlot) => {
                  console.log("Dropping at time:", timeSlot, person);
                  onDrop(courtId, person, position, timeSlot);
                }}
                onActivityDrop={(courtId, activity, timeSlot) => {
                  console.log("Dropping activity at time:", timeSlot, activity);
                  onActivityDrop(courtId, activity, timeSlot);
                }}
                onRemovePerson={(personId, time) => onRemovePerson(personId, time)}
                onRemoveActivity={(activityId, time) => onRemoveActivity(activityId, time)}
              />
            ))}
          </div>
        </div>
        
        {/* Time Selection Bar - Now relative to each court */}
        <div className="w-10 absolute right-0 top-0 bottom-0 flex flex-col items-center bg-white/90 border-l border-gray-100 overflow-y-auto">
          <div className="py-1 flex flex-col items-center w-full">
            {timeSlots.map((time, index) => (
              <button
                key={`nav-${time}`}
                onClick={() => scrollToTimeSlot(index)}
                className="w-full text-xs py-1 hover:bg-gray-100 text-gray-700 font-medium"
              >
                {time.split(':')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
