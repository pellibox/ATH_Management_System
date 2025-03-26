
import React from "react";
import { X, Clock } from "lucide-react";
import { PersonData } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CourtPersonProps {
  person: PersonData;
  index?: number;
  total?: number;
  onRemove?: () => void;
  className?: string;
  isSpanning?: boolean;
}

export function CourtPerson({ 
  person, 
  index = 0, 
  total = 1, 
  onRemove,
  className = "",
  isSpanning = false
}: CourtPersonProps) {
  const isCoach = person.type === "coach";
  const textColor = isCoach ? "text-white" : "text-gray-800";
  const bgColor = isCoach 
    ? person.programColor || "bg-red-500" 
    : person.programColor || "bg-blue-200";
  
  // Add indication for spanning time slots
  const durationInfo = person.durationHours && person.durationHours > 1
    ? `(${person.durationHours}h)`
    : "";
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              relative px-2 py-1 rounded-md text-xs font-medium
              ${bgColor} ${textColor} ${className}
              ${isSpanning ? 'border-t border-dashed' : ''}
            `}
            style={{ minWidth: '80px' }}
          >
            <div className="flex justify-between items-center">
              <span>
                {person.name} {!isSpanning && durationInfo}
              </span>
              
              {!isSpanning && person.durationHours && person.durationHours > 1 && (
                <Clock className="h-3 w-3 ml-1" />
              )}
              
              {onRemove && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p><strong>{person.name}</strong></p>
            <p>{person.type === "coach" ? "Coach" : "Player"}</p>
            {person.programId && <p>Program: {person.programId}</p>}
            {person.durationHours && <p>Duration: {person.durationHours} hour{person.durationHours !== 1 ? 's' : ''}</p>}
            {person.timeSlot && <p>Time: {person.timeSlot}{person.endTimeSlot ? ` - ${person.endTimeSlot}` : ''}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
