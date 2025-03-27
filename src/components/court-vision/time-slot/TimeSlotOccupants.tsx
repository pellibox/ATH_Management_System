
import React from "react";
import { PersonData } from "../types";
import { AlertTriangle, X } from "lucide-react";
import { CoachAssignmentsTooltip } from "./CoachAssignmentsTooltip";

interface TimeSlotOccupantsProps {
  occupants: PersonData[];
  onRemovePerson: (personId: string, time?: string) => void;
  time: string;
  conflicts?: Record<string, string[]>;
}

export function TimeSlotOccupants({ 
  occupants, 
  onRemovePerson,
  time,
  conflicts = {}
}: TimeSlotOccupantsProps) {
  // Sort occupants: coaches first, then players
  const sortedOccupants = [...occupants].sort((a, b) => {
    if (a.type === "coach" && b.type !== "coach") return -1;
    if (a.type !== "coach" && b.type === "coach") return 1;
    return a.name.localeCompare(b.name);
  });
  
  return (
    <div className="flex flex-wrap gap-1 items-center">
      {sortedOccupants.map(person => {
        const hasConflict = conflicts[time] && conflicts[time].includes(person.id);
        
        return (
          <div 
            key={person.id}
            className={`flex items-center rounded-full text-xs px-2 py-1 ${
              person.type === "coach" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
            } ${
              person.status === "pending" ? "opacity-70 border border-dashed border-gray-400" : 
              person.status === "conflict" ? "border border-orange-400" : ""
            } ${
              hasConflict ? "ring-2 ring-orange-400 animate-pulse" : ""
            }`}
            style={{
              backgroundColor: person.programColor ? `${person.programColor}30` : undefined,
              color: person.programColor ? `${person.programColor}` : undefined,
              borderColor: person.programColor ? `${person.programColor}` : undefined
            }}
          >
            {person.type === "coach" ? (
              // Coach with tooltip showing assignments
              <CoachAssignmentsTooltip coach={person}>
                <span className="flex items-center">
                  {person.name}
                  {(hasConflict || person.status === "conflict") && (
                    <AlertTriangle className="ml-1 h-3 w-3 text-orange-500" />
                  )}
                </span>
              </CoachAssignmentsTooltip>
            ) : (
              // Regular player display
              <span>{person.name}</span>
            )}
            
            <button
              className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              onClick={() => onRemovePerson(person.id, time)}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
