
import React from "react";
import { X, Clock, AlertCircle } from "lucide-react";
import { PersonData } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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
  isSpanning = false,
  position
}: CourtPersonProps) {
  const isCoach = person.type === "coach";
  
  // Enhanced color-coding based on person type
  let bgColor, textColor, borderColor, gradientStyle;
  
  if (isCoach) {
    // Coaches get a more distinct coloring
    bgColor = person.programColor || "bg-ath-red-clay";
    textColor = "text-white";
    borderColor = "border-white/30";
    
    // Add gradient effect for spanning blocks
    gradientStyle = isSpanning 
      ? { backgroundImage: `linear-gradient(to bottom, ${person.programColor || "#b00c20"}, ${person.programColor || "#b00c20"}80)` }
      : { backgroundColor: person.programColor || "#b00c20" };
  } else {
    // Players get a lighter background with darker text
    bgColor = person.programColor ? `${person.programColor}20` : "bg-blue-100";
    textColor = person.programColor ? `text-blue-700` : "text-blue-700";
    borderColor = person.programColor ? `border-${person.programColor}` : "border-blue-300";
    
    // Add gradient effect for spanning blocks
    gradientStyle = isSpanning 
      ? { backgroundImage: `linear-gradient(to bottom, ${person.programColor ? `${person.programColor}30` : "#e6f0ff"}, ${person.programColor ? `${person.programColor}10` : "#f0f7ff"})` }
      : { backgroundColor: person.programColor ? `${person.programColor}20` : "#e6f0ff" };
  }
  
  // Special styling for time slots that span multiple periods
  const spanningStyles = isSpanning 
    ? 'border-t border-dashed opacity-90' 
    : '';
  
  // Calculate remaining hours for the player
  const programLimit = person.programId ? 4 : 2; // Example limit based on program
  const usedHours = person.hoursAssigned || 0;
  const remainingHours = Math.max(0, programLimit - usedHours);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              relative px-2 py-1 rounded-md text-xs font-medium
              ${textColor}
              ${className} ${spanningStyles} border border-${borderColor}
              flex-shrink-0 flex items-center justify-between
              shadow-sm hover:shadow-md transition-shadow
            `}
            style={{ 
              minWidth: '90px',
              maxWidth: '100%',
              ...gradientStyle,
              position: 'relative'
            }}
          >
            <div className="flex justify-between items-center w-full truncate">
              <span className="truncate mr-1">
                {person.name}
              </span>
              
              <div className="flex items-center flex-shrink-0">
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
            
            {/* Duration badge */}
            {!isSpanning && (
              <div className="absolute -top-2 -right-2 flex gap-0.5">
                <Badge 
                  className={`text-[9px] ${isCoach ? 'bg-red-500' : 'bg-blue-500'} text-white px-1 py-0 min-w-5 h-4 flex items-center justify-center`}
                >
                  <Clock className="h-2 w-2 mr-0.5" />
                  {person.durationHours || 1}h
                </Badge>
                
                {/* Remaining hours badge for players */}
                {!isCoach && (
                  <Badge 
                    className={`text-[9px] px-1 py-0 min-w-5 h-4 flex items-center justify-center ${
                      remainingHours > 0 ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                    }`}
                  >
                    {remainingHours}h
                  </Badge>
                )}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p><strong>{person.name}</strong></p>
            <p>{person.type === "coach" ? "Coach" : "Player"}</p>
            {person.programId && <p>Program: {person.programId}</p>}
            {person.durationHours && <p>Duration: {person.durationHours} hour{person.durationHours !== 1 ? 's' : ''}</p>}
            {person.timeSlot && <p>Time: {person.timeSlot}{person.endTimeSlot ? ` - ${person.endTimeSlot}` : ''}</p>}
            {person.type === "player" && (
              <p>Daily Limit: {person.hoursAssigned || 0}/{programLimit} hours</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
