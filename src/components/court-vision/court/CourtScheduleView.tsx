
import React, { useRef } from "react";
import { TimeSlot } from "../time-slot/TimeSlot";
import { PersonData, ActivityData } from "../types";
import { isTimeSlotOccupied } from "./CourtStyleUtils";

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
        
        {/* Floating Time Selection Bar */}
        <div className="w-12 fixed right-0 top-1/2 transform -translate-y-1/2 bg-white/95 border border-gray-200 rounded-l-lg shadow-md z-20 flex flex-col overflow-visible max-h-[80vh]">
          <div className="py-2 flex flex-col items-center w-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {timeSlots.map((time, index) => (
              <button
                key={`nav-${time}`}
                onClick={() => scrollToTimeSlot(index)}
                className="w-full text-xs py-1.5 hover:bg-gray-100 text-gray-700 font-medium"
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
