
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
  position?: { x: number, y: number };
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
  
  // Enhanced color-coding based on person type
  let bgColor, textColor, borderColor;
  
  if (isCoach) {
    // Coaches get a more distinct coloring
    bgColor = person.programColor || "bg-ath-red-clay";
    textColor = "text-white";
    borderColor = "border-white/30";
  } else {
    // Players get a lighter background with darker text
    bgColor = person.programColor ? `${person.programColor}20` : "bg-blue-100";
    textColor = person.programColor || "text-blue-700";
    borderColor = person.programColor ? `border-${person.programColor}` : "border-blue-300";
  }
  
  // Add indication for spanning time slots
  const durationInfo = person.durationHours && person.durationHours > 1
    ? `(${person.durationHours}h)`
    : "";
  
  // Special styling for time slots that span multiple periods
  const spanningStyles = isSpanning 
    ? 'border-t border-dashed opacity-90' 
    : '';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              relative px-2 py-1 rounded-md text-xs font-medium
              ${isCoach ? bgColor : bgColor} ${textColor}
              ${className} ${spanningStyles} border border-${borderColor}
              flex-shrink-0 flex items-center justify-between
              shadow-sm hover:shadow-md transition-shadow
            `}
            style={{ 
              minWidth: '85px',
              maxWidth: '100%',
              backgroundColor: isCoach ? (person.programColor || "#b00c20") : (person.programColor ? `${person.programColor}20` : "#e6f0ff")
            }}
          >
            <div className="flex justify-between items-center w-full truncate">
              <span className="truncate mr-1">
                {person.name} {!isSpanning && durationInfo}
              </span>
              
              <div className="flex items-center flex-shrink-0">
                {!isSpanning && person.durationHours && person.durationHours > 1 && (
                  <Clock className="h-3 w-3 ml-1 flex-shrink-0" />
                )}
                
                {onRemove && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
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
