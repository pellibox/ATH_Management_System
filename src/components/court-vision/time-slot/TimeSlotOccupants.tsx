
import React from "react";
import { PersonData } from "../types";
import { CourtPerson } from "../CourtPerson";
import { isTimeSlotOccupied, getTimeSlotContinuationStyle } from "../court/CourtStyleUtils";
import { calculateProgramDuration, calculateTimeSlotSpan } from "./utils";

interface TimeSlotOccupantsProps {
  occupants: PersonData[];
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  time: string;
}

export function TimeSlotOccupants({ 
  occupants, 
  onRemovePerson,
  time 
}: TimeSlotOccupantsProps) {
  // Define timeSlots array for this component
  const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", 
                     "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
                     "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", 
                     "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
  
  if (!occupants || occupants.length === 0) {
    return <div className="relative w-full h-full"></div>;
  }

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-wrap gap-1 absolute left-0 top-1/2 transform -translate-y-1/2 ml-2">
        {occupants.map((person, index) => {
          // Check if this is a continuation slot or the starting slot
          const isContinuationSlot = person.timeSlot !== time && isTimeSlotOccupied(person, time, timeSlots);
          const continuationStyle = getTimeSlotContinuationStyle(person, time, timeSlots);
          
          // Only show remove button on the starting slot
          const showRemoveButton = person.timeSlot === time;
          
          // For continuation slots, add special styling
          const personClass = isContinuationSlot ? `${continuationStyle} border-t border-dashed border-gray-300` : '';
          
          return (
            <CourtPerson
              key={`${person.id}-${index}-${time}`}
              person={person}
              index={index}
              total={occupants.length}
              onRemove={showRemoveButton ? () => onRemovePerson(person.id, time) : undefined}
              className={personClass}
              isSpanning={isContinuationSlot}
            />
          );
        })}
      </div>
    </div>
  );
}
