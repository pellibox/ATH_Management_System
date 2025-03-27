
import React from 'react';
import { PersonData } from '../types';
import { Calendar, Clock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CoachAssignmentsTooltipProps {
  coach: PersonData;
  children: React.ReactNode;
}

export function CoachAssignmentsTooltip({ coach, children }: CoachAssignmentsTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[250px] p-2">
          <div className="space-y-2">
            <div className="font-semibold text-sm border-b pb-1">{coach.name}</div>
            
            {/* Assignment summary */}
            <div className="text-xs space-y-1">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                <span>
                  {coach.timeSlot} 
                  {coach.endTimeSlot && ` - ${coach.endTimeSlot}`}
                </span>
              </div>
              
              {coach.courtId && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                  <span>Campo {coach.courtId}</span>
                </div>
              )}
              
              {/* Status indicator */}
              {coach.status === 'conflict' && (
                <div className="text-xs text-orange-500 font-medium mt-1">
                  Questo coach ha un conflitto di assegnazione
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
