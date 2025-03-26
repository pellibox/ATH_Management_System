
import React from "react";
import { Users, Clock, Info } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface TimeSlotIndicatorsProps {
  occupantsCount: number;
  activitiesCount: number;
}

export function TimeSlotIndicators({ 
  occupantsCount, 
  activitiesCount 
}: TimeSlotIndicatorsProps) {
  return (
    <>
      {occupantsCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-1 right-1 flex items-center text-xs text-gray-700 font-medium bg-gray-100 rounded-full px-1.5 py-0.5">
                <Users className="h-3 w-3 mr-1" aria-label="Number of people" />
                {occupantsCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{occupantsCount} persone assegnate a questo slot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {activitiesCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-1 left-1 flex items-center text-xs text-gray-700 font-medium bg-gray-100 rounded-full px-1.5 py-0.5">
                <Clock className="h-3 w-3 mr-1" aria-label="Number of activities" />
                {activitiesCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{activitiesCount} attività in questo slot</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
