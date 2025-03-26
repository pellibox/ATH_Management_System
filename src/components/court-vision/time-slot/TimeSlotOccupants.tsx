
import React from "react";
import { PersonData } from "../types";
import { CourtPerson } from "../CourtPerson";

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
  return (
    <div className="relative h-full w-full min-h-[60px] mt-5">
      {occupants.map((person, index) => (
        <CourtPerson
          key={person.id}
          person={person}
          index={index}
          total={occupants.length}
          onRemove={() => onRemovePerson(person.id, time)}
        />
      ))}
    </div>
  );
}
