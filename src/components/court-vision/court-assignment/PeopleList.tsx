
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PersonData } from "../types";
import { PERSON_TYPES } from "../constants";

interface PeopleListProps {
  people: PersonData[];
  showAssigned: boolean;
  selectedTimeSlot?: string;
  onAssign?: (person: PersonData) => void;
  onRemove?: (personId: string, timeSlot?: string) => void;
}

export function PeopleList({ 
  people, 
  showAssigned, 
  selectedTimeSlot,
  onAssign,
  onRemove
}: PeopleListProps) {
  if (people.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-2">
        {showAssigned ? "No people assigned to this court" : "All people assigned to courts"}
      </div>
    );
  }

  // Filter by time slot if applicable
  const filteredPeople = selectedTimeSlot 
    ? people.filter(person => !person.timeSlot || person.timeSlot === selectedTimeSlot) 
    : people;

  // Handler to prepare person for assignment
  const handleAssign = (person: PersonData) => {
    if (onAssign) {
      // Always ensure coaches have duration set
      if (person.type === PERSON_TYPES.COACH) {
        const personWithDuration = {
          ...person,
          durationHours: person.durationHours || 1 // Default duration for coaches
        };
        onAssign(personWithDuration);
      } else {
        onAssign(person);
      }
    }
  };

  return (
    <div className="space-y-2">
      {filteredPeople.map((person) => (
        <div
          key={person.id}
          className="flex items-center justify-between p-2 border rounded"
        >
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2 ${
                person.type === PERSON_TYPES.PLAYER
                  ? "bg-ath-red-clay text-white"
                  : "bg-ath-black text-white"
              }`}
            >
              {person.name.substring(0, 2)}
            </div>
            <span className="text-sm">{person.name}</span>
          </div>
          {showAssigned && onRemove ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemove(person.id, person.timeSlot)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Remove
            </Button>
          ) : onAssign ? (
            <Button
              size="sm"
              className="bg-ath-red-clay hover:bg-ath-red-clay-dark"
              onClick={() => handleAssign(person)}
            >
              Assign
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
