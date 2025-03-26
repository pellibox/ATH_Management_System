
import { useState } from "react";
import { useDrop } from "react-dnd";
import { PERSON_TYPES } from "./constants";
import { PersonData, ActivityData } from "./types";
import { CourtPerson } from "./CourtPerson";
import { Clock, Users, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CourtActivity } from "./CourtActivity";

interface TimeSlotProps {
  time: string;
  courtId: string;
  occupants: PersonData[];
  activities: ActivityData[];
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
}

export function TimeSlot({ 
  time, 
  courtId, 
  occupants, 
  activities,
  onRemovePerson,
  onRemoveActivity,
  onDrop,
  onActivityDrop
}: TimeSlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity"],
    drop: (item: any) => {
      if (item.type === "activity") {
        // Handle activity drop
        const activity = item as ActivityData;
        onActivityDrop(courtId, activity, time);
      } else {
        // Handle person drop
        const person = item as PersonData;
        onDrop(courtId, person, undefined, time);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Filter occupants for this time slot
  const slotOccupants = occupants.filter(
    occupant => occupant.timeSlot === time
  );
  
  // Filter activities for this time slot
  const slotActivities = activities.filter(
    activity => activity.timeSlot === time
  );
  
  return (
    <div
      ref={drop}
      className={`min-h-20 border-b border-gray-200 p-2 relative ${
        isOver ? "bg-gray-100" : ""
      }`}
    >
      <div className="absolute top-0 left-0 p-1 text-xs font-medium text-gray-500 bg-white/80 rounded">
        {time}
      </div>
      
      {/* Activities */}
      {slotActivities.length > 0 && (
        <div className="mt-5">
          {slotActivities.map((activity, index) => (
            <CourtActivity
              key={activity.id}
              activity={activity}
              onRemove={() => onRemoveActivity(activity.id, time)}
            />
          ))}
        </div>
      )}
      
      {/* Court occupants (people) */}
      <div className="relative h-full w-full min-h-[60px] mt-5">
        {slotOccupants.map((person, index) => (
          <CourtPerson
            key={person.id}
            person={person}
            index={index}
            total={slotOccupants.length}
            onRemove={() => onRemovePerson(person.id, time)}
          />
        ))}
      </div>
      
      {/* Indicator for number of occupants */}
      {slotOccupants.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-1 right-1 flex items-center text-xs text-gray-700 font-medium bg-gray-100 rounded-full px-1.5 py-0.5">
                <Users className="h-3 w-3 mr-1" aria-label="Number of people" />
                {slotOccupants.length}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{slotOccupants.length} persone assegnate a questo slot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Indicator for number of activities */}
      {slotActivities.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-1 left-1 flex items-center text-xs text-gray-700 font-medium bg-gray-100 rounded-full px-1.5 py-0.5">
                <Clock className="h-3 w-3 mr-1" aria-label="Number of activities" />
                {slotActivities.length}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{slotActivities.length} attività in questo slot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
