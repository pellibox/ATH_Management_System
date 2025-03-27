
import React from "react";
import { PersonData } from "../types";
import { X, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPersonProgramColor, isPersonUnavailable } from "../utils/personUtils";
import { cn } from "@/lib/utils";

interface TimeSlotOccupantsProps {
  occupants: PersonData[];
  onRemovePerson: (personId: string, time?: string) => void;
  time?: string;
  conflicts?: Record<string, string[]>;
}

export function TimeSlotOccupants({
  occupants,
  onRemovePerson,
  time,
  conflicts = {}
}: TimeSlotOccupantsProps) {
  if (occupants.length === 0) return null;

  // Sort occupants: coaches first, then players, sorted by name within each group
  const sortedOccupants = [...occupants].sort((a, b) => {
    if (a.type === "coach" && b.type !== "coach") return -1;
    if (a.type !== "coach" && b.type === "coach") return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  return (
    <div className="flex flex-wrap gap-1 max-w-full">
      {sortedOccupants.map((person) => {
        // Get program color for visual indicators
        const programColor = getPersonProgramColor(person);
        
        // Check if this person has conflicts in this time slot
        const hasConflict = time && conflicts[time] ? conflicts[time].includes(person.id) : false;
        
        // Determine status-based styling
        let statusClasses = "";
        let statusPattern = "";
        
        if (hasConflict) {
          statusClasses = "border-orange-400 animate-pulse-border";
        } else if (person.status === "pending") {
          statusClasses = "border-amber-400";
          statusPattern = "bg-stripes";
        } else if (person.status === "confirmed") {
          statusClasses = "border-green-400";
        } else {
          statusClasses = "border-gray-300";
        }
        
        return (
          <div
            key={person.id}
            className={cn(
              "flex items-center p-1 pr-2 rounded-md text-xs border relative group transition-all",
              statusClasses,
              isPersonUnavailable(person) ? "bg-gray-100 text-gray-400" : "bg-white",
              person.timeSlot === time ? "shadow-sm" : ""
            )}
            style={{
              borderLeftWidth: "3px",
              borderLeftColor: programColor
            }}
          >
            {/* Program color indicator on the left */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-1"
              style={{ backgroundColor: programColor }}
            />
            
            {/* Person info */}
            <div className="ml-1 flex items-center gap-1">
              {/* Person type indicator */}
              {person.type === "coach" ? (
                <span className="bg-red-100 text-red-800 rounded-full p-0.5 text-[10px] font-medium">C</span>
              ) : (
                <span className="bg-blue-100 text-blue-800 rounded-full p-0.5 text-[10px] font-medium">P</span>
              )}
              
              {/* Person name */}
              <span className="font-medium truncate max-w-[80px]">
                {person.name}
              </span>
              
              {/* Conflict indicator */}
              {hasConflict && (
                <AlertCircle className="h-3 w-3 text-orange-500" />
              )}
            </div>
            
            {/* Duration badge, if this is the starting time slot */}
            {person.timeSlot === time && person.durationHours && (
              <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0 h-4 bg-white">
                {person.durationHours}h
              </Badge>
            )}
            
            {/* Remove button */}
            <button
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-gray-100 p-0.5"
              onClick={() => onRemovePerson(person.id, time)}
              aria-label={`Remove ${person.name}`}
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
