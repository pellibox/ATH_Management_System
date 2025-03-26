
import { useState } from "react";
import { PersonData, Program } from "./types";
import { Mail, Phone, Send, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export interface PlayerCardProps {
  player: PersonData;
  programs: Program[];
  onAssignProgram?: (playerId: string, programId: string) => void;
  onSendSchedule?: (playerId: string, type: "day" | "week" | "month") => void;
  onViewCalendar?: () => void;  // Add this prop
  multiplePrograms?: boolean;
}

export function PlayerCard({ 
  player, 
  programs, 
  onAssignProgram, 
  onSendSchedule,
  onViewCalendar,  // Add this prop
  multiplePrograms = false 
}: PlayerCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get program names for display
  const playerProgramIds = multiplePrograms 
    ? (player.programIds || []) 
    : (player.programId ? [player.programId] : []);
  
  const assignedPrograms = programs
    .filter(p => playerProgramIds.includes(p.id))
    .map(p => p.name);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
            {player.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 truncate">{player.name}</h3>
            <p className="text-sm text-gray-500 truncate">
              {player.sportTypes && player.sportTypes.length > 0 
                ? player.sportTypes.join(", ") 
                : "Nessuno sport assegnato"}
            </p>
          </div>
        </div>
        
        <div className="mt-3">
          {assignedPrograms.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {assignedPrograms.map((programName, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {programName}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Nessun programma assegnato</p>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
          {player.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span>{player.email}</span>
            </div>
          )}
          
          {player.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <span>{player.phone}</span>
            </div>
          )}
          
          {onAssignProgram && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Programmi:</p>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {programs.map(program => (
                  <div key={program.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`program-${program.id}`}
                      checked={playerProgramIds.includes(program.id)}
                      onCheckedChange={() => onAssignProgram(player.id, program.id)}
                    />
                    <label 
                      htmlFor={`program-${program.id}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {program.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
            {onSendSchedule && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Send className="h-3.5 w-3.5 mr-1" />
                    <span>Invia Orari</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onSendSchedule(player.id, "day")}>
                    Giornaliero
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSendSchedule(player.id, "week")}>
                    Settimanale
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSendSchedule(player.id, "month")}>
                    Mensile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {onViewCalendar && (
              <Button variant="outline" size="sm" className="flex items-center" onClick={onViewCalendar}>
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Calendario</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
