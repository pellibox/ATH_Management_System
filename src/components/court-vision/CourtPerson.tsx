
import React from "react";
import { X, Clock, AlertCircle, User, UserCog } from "lucide-react";
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
  hasConflict?: boolean;
  isConfirmed?: boolean;
}

export function CourtPerson({ 
  person, 
  index = 0, 
  total = 1, 
  onRemove,
  className = "",
  isSpanning = false,
  position,
  hasConflict = false,
  isConfirmed = true
}: CourtPersonProps) {
  const isCoach = person.type === "coach";
  
  // Enhanced color-coding based on person type and program
  let bgColor, textColor, borderColor, gradientStyle;
  
  // Get program color (fallback to default if not found)
  const programColor = person.programColor || 
    (isCoach ? "#b00c20" : "#3b82f6"); // Red for coaches, blue for players
  
  // Apply status styling
  if (isCoach) {
    // Coaches get a more distinct coloring with program influence
    const bgOpacity = isSpanning ? '90' : '';  // Less opacity for spanning blocks
    
    bgColor = `bg-[${programColor}${bgOpacity}]`;
    textColor = "text-white";
    borderColor = "border-white/30";
    
    // Add gradient effect for spanning blocks
    gradientStyle = isSpanning 
      ? { backgroundImage: `linear-gradient(to bottom, ${programColor}, ${programColor}80)` }
      : { backgroundColor: programColor };
  } else {
    // Players get program-colored styling
    bgColor = `bg-[${programColor}20]`; // Light background with program color
    textColor = "text-gray-800";
    borderColor = `border-[${programColor}]`;
    
    // Add gradient effect for spanning blocks
    gradientStyle = isSpanning 
      ? { backgroundImage: `linear-gradient(to bottom, ${programColor}30, ${programColor}10)` }
      : { backgroundColor: `${programColor}20` };
  }
  
  // Add prominent left border with program color
  const programBorder = { 
    borderLeftColor: programColor, 
    borderLeftWidth: '4px' 
  };
  
  // Special styling for time slots that span multiple periods
  const spanningStyles = isSpanning 
    ? 'border-t border-dashed opacity-90' 
    : '';
  
  // Styling for confirmation status
  const confirmationStyle = !isConfirmed
    ? 'bg-stripes' // Add striped background for unconfirmed
    : '';
  
  // Styling for conflicts
  const conflictStyle = hasConflict
    ? 'border-2 border-orange-500 animate-pulse' // Pulsing border for conflicts
    : '';
  
  // Calculate program-based default duration and daily limits
  const getDefaultDuration = () => {
    if (!person.programId) return 1;
    // Different programs have different default durations
    const programDurations: Record<string, number> = {
      "perf2": 1.5,
      "perf3": 1.5,
      "perf4": 1.5,
      "elite": 1.5,
      "elite-full": 2,
      "junior-sit": 1,
      "junior-sat": 1,
    };
    return programDurations[person.programId] || 1;
  };
  
  const getDailyLimit = () => {
    if (!person.programId) return 2;
    // Different programs have different daily limits
    const programLimits: Record<string, number> = {
      "perf2": 3,
      "perf3": 4.5,
      "perf4": 6,
      "elite": 7.5,
      "elite-full": 10,
      "junior-sit": 3,
      "junior-sat": 1.5,
    };
    return programLimits[person.programId] || 2;
  };
  
  const defaultDuration = getDefaultDuration();
  const dailyLimit = getDailyLimit();
  const hoursAssigned = person.hoursAssigned || 0;
  const remainingHours = Math.max(0, dailyLimit - hoursAssigned);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              relative px-2 py-1 rounded-md text-xs font-medium
              ${textColor} ${className} ${spanningStyles} 
              ${confirmationStyle} ${conflictStyle}
              border ${borderColor}
              flex-shrink-0 flex items-center justify-between
              shadow-sm hover:shadow-md transition-shadow
            `}
            style={{ 
              minWidth: '90px',
              maxWidth: '100%',
              ...gradientStyle,
              ...programBorder,
              position: 'relative'
            }}
          >
            <div className="flex justify-between items-center w-full truncate">
              <div className="flex items-center space-x-1">
                {/* Type icon */}
                <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  {isCoach ? 
                    <UserCog className="h-3 w-3" /> : 
                    <User className="h-3 w-3" />
                  }
                </span>
                
                <span className="truncate">
                  {person.name}
                </span>
              </div>
              
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
            
            {/* Program indicator dot */}
            {person.programColor && !isSpanning && (
              <div 
                className="absolute left-0 top-0 w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: person.programColor }}
              />
            )}
            
            {/* Duration badge */}
            {!isSpanning && (
              <div className="absolute -top-2 -right-2 flex gap-0.5">
                <Badge 
                  className={`text-[9px] ${isCoach ? 'bg-red-500' : 'bg-blue-500'} text-white px-1 py-0 min-w-5 h-4 flex items-center justify-center`}
                  style={{ backgroundColor: programColor }}
                >
                  <Clock className="h-2 w-2 mr-0.5" />
                  {person.durationHours || defaultDuration}h
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
            
            {/* Conflict indicator */}
            {hasConflict && (
              <div className="absolute -top-2 -left-2">
                <AlertCircle className="h-4 w-4 text-orange-500 fill-white" />
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
              <p>Daily Limit: {person.hoursAssigned || 0}/{dailyLimit} hours</p>
            )}
            {hasConflict && (
              <p className="text-orange-500 font-semibold">⚠️ Has scheduling conflict</p>
            )}
            {!isConfirmed && (
              <p className="text-blue-500 italic">Pending confirmation</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
