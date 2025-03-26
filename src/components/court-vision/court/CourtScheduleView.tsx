
import React, { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeSlot } from "../time-slot/TimeSlot";
import { PersonData, ActivityData } from "../types";
import { isTimeSlotOccupied } from "./CourtStyleUtils";
import { ScrollControl } from "./ScrollControl";

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

  return (
    <div className="flex-1 flex flex-col mt-12 mb-1 h-full overflow-hidden relative">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="h-8 border-b border-gray-200 flex items-center px-2">
          <span className="text-xs font-medium">Orari - {courtName} #{courtNumber}</span>
        </div>
      </div>
      
      <div ref={scrollContainerRef} className="flex-1 overflow-auto h-[calc(100%-2rem)] relative">
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
        
        {/* Scroll control positioned on the inside of the court */}
        <ScrollControl containerRef={scrollContainerRef} />
      </div>
    </div>
  );
}
