
import { useState } from "react";
import { Users } from "lucide-react";
import { Person } from "./Person";
import { PersonData, Program } from "./types";
import { PERSON_TYPES } from "./constants";

export interface AvailablePeopleProps {
  people: PersonData[];
  programs?: Program[];
  onAddPerson?: (person: {name: string, type: string}) => void;
  onRemovePerson?: (id: string) => void;
  onDrop?: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onAddToDragArea?: (person: PersonData) => void;
  playersList?: PersonData[];
  coachesList?: PersonData[];
}

export function AvailablePeople({ 
  people, 
  programs = [], 
  onAddPerson,
  onRemovePerson,
  onDrop,
  onAddToDragArea,
  playersList,
  coachesList
}: AvailablePeopleProps) {
  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center truncate">
        <Users className="h-4 w-4 mr-2 flex-shrink-0" /> 
        <span className="truncate">Available People</span>
      </h2>
      
      <div className="max-h-[180px] overflow-y-auto">
        {people.length > 0 ? (
          people.map((person) => (
            <Person
              key={person.id}
              person={person}
              onRemove={onRemovePerson ? () => onRemovePerson(person.id) : undefined}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 italic p-2">
            All people assigned to courts
          </div>
        )}
      </div>
    </div>
  );
}
