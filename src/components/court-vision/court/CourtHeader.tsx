
import React from "react";
import { PersonData } from "../types";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface CourtHeaderProps {
  courtName: string;
  courtNumber: number;
  courtType: string;
  occupants: PersonData[];
  onValidate: () => void;
  onChangeNumber: (number: number) => void;
}

export function CourtHeader({
  courtName,
  courtNumber,
  courtType,
  occupants,
  onValidate,
  onChangeNumber
}: CourtHeaderProps) {
  // Get coaches for this court
  const coachesAssigned = occupants.filter(
    p => p.type === "coach"
  );
  
  // Check if we have any conflicts
  const conflictingCoaches = occupants.filter(
    p => p.type === "coach" && p.status === "conflict"
  );
  
  const hasConflicts = conflictingCoaches.length > 0;
  
  // Calculate healthScore based on conflicts
  const healthScore = hasConflicts ? 70 : 100;
  
  return (
    <div className="p-2 flex items-center justify-between border-b">
      <div className="flex-1">
        <h3 className="text-sm font-semibold flex items-center">
          {courtName} #{courtNumber}
          <span className="text-xs font-normal ml-2 text-gray-500">
            {courtType}
          </span>
        </h3>
        <div className="flex items-center mt-1">
          {coachesAssigned.length > 0 ? (
            <span className="text-xs text-gray-600">
              {coachesAssigned.length} coach assegnati
            </span>
          ) : (
            <span className="text-xs text-gray-400">
              Nessun coach assegnato
            </span>
          )}
          
          {/* Health indicator */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2 flex items-center">
                  {hasConflicts ? (
                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                  ) : (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                  <span className={`text-xs ml-1 ${
                    hasConflicts ? 'text-orange-500' : 'text-green-500'
                  }`}>
                    {healthScore}%
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                {hasConflicts 
                  ? `${conflictingCoaches.length} conflitti coach rilevati` 
                  : 'Nessun conflitto rilevato'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div>
        <Button 
          variant="outline"
          size="sm"
          className="text-xs h-7"
          onClick={onValidate}
        >
          {hasConflicts ? (
            <>
              <AlertTriangle className="h-3 w-3 mr-1 text-orange-500" />
              Mostra conflitti
            </>
          ) : (
            "Verifica"
          )}
        </Button>
      </div>
    </div>
  );
}
