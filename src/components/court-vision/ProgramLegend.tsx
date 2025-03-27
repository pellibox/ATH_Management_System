
import React, { useState } from "react";
import { Program } from "./types";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProgramLegendProps {
  programs: Program[];
}

export function ProgramLegend({ programs }: ProgramLegendProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Program duration mapping (in hours)
  const programDurations: Record<string, number> = {
    "program1": 1.5, // Tennis Academy
    "program2": 1, // Padel Club
    "program3": 1, // Junior Development
    "program4": 2, // High Performance
    "perf2": 1.5,
    "perf3": 1.5,
    "perf4": 1.5,
    "elite": 2,
    "elite-full": 2,
    "junior-sit": 1,
    "junior-sat": 1,
    "personal-coaching": 1.5,
    "lezioni-private": 1,
    "adult": 1,
    "university": 1.5,
    "coach": 2,
  };

  // Weekly hours limit by program
  const weeklyHoursLimit: Record<string, number> = {
    "program1": 4.5, // Tennis Academy
    "program2": 3, // Padel Club
    "program3": 3, // Junior Development
    "program4": 10, // High Performance
    "perf2": 6,
    "perf3": 9,
    "perf4": 12,
    "elite": 7.5,
    "elite-full": 30.5,
    "junior-sit": 3,
    "junior-sat": 1.5,
    "personal-coaching": 1.5,
    "lezioni-private": 0,
    "adult": 1,
    "university": 1.5,
    "coach": 0,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Legenda Programmi</h3>
          <CollapsibleTrigger asChild>
            <button className="rounded-full p-1 hover:bg-gray-100">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {programs.map((program) => (
              <div 
                key={program.id} 
                className="flex items-center justify-between border-b border-gray-100 pb-1"
              >
                <div className="flex items-center space-x-2">
                  {/* Color indicator */}
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: program.color }}
                  />
                  
                  <span className="text-xs font-medium">{program.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {programDurations[program.id] || 1}h
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Durata standard sessione</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {weeklyHoursLimit[program.id] > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant="outline" 
                            className="text-[9px] h-5 bg-gray-50"
                          >
                            {weeklyHoursLimit[program.id]}h/sett
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Ore settimanali previste</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[200px]">
                        <div className="text-xs space-y-1">
                          <p className="font-medium">{program.name}</p>
                          <p>Durata sessione: {programDurations[program.id] || 1}h</p>
                          {weeklyHoursLimit[program.id] > 0 && (
                            <p>Ore settimanali: {weeklyHoursLimit[program.id]}</p>
                          )}
                          {program.totalWeeks && (
                            <p>Durata: {program.totalWeeks} settimane</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
