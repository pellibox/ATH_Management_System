
import { useState, useMemo } from "react";
import { Users, User, UserCog, Filter, AlertCircle } from "lucide-react";
import { PersonCard } from "./PersonCard";
import { PersonData, Program } from "./types";
import { PERSON_TYPES } from "./constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getProgramColor } from "@/components/players/utils/programUtils";

export interface AvailablePeopleProps {
  people: PersonData[];
  programs: Program[];
  onAddPerson?: (person: {name: string, type: string, email?: string, phone?: string, sportTypes?: string[]}) => void;
  onRemovePerson?: (id: string) => void;
  onDrop?: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onAddToDragArea?: (person: PersonData) => void;
  playersList?: PersonData[];
  coachesList?: PersonData[];
  programFilter?: string;
  availabilityFilter?: string;
}

export function AvailablePeople({ 
  people, 
  programs = [], 
  onAddPerson,
  onRemovePerson,
  onDrop,
  onAddToDragArea,
  playersList = [],
  coachesList = [],
  programFilter = "all",
  availabilityFilter = "all"
}: AvailablePeopleProps) {
  const { toast } = useToast();
  
  // Determine which list to show based on provided props
  const showPlayers = playersList && playersList.length > 0;
  const showCoaches = coachesList && coachesList.length > 0 && !showPlayers;
  
  // For coaches, we'll show ALL coaches
  const availableCoaches = coachesList;
  
  // Filter available people by type and program
  const filteredPlayers = useMemo(() => {
    if (!showPlayers) return [];
    
    return playersList.filter(player => {
      if (programFilter === "all") return true;
      if (programFilter === "none") return !player.programId && (!player.programIds || player.programIds.length === 0);
      return player.programId === programFilter || (player.programIds && player.programIds.includes(programFilter));
    });
  }, [playersList, programFilter, showPlayers]);
  
  const filteredCoaches = useMemo(() => {
    if (!showCoaches && !coachesList.length) return [];
    
    return availableCoaches.filter(coach => {
      // First apply program filter
      const passesProgram = programFilter === "all" 
        ? true 
        : programFilter === "none" 
          ? !coach.programId && (!coach.programIds || coach.programIds.length === 0)
          : coach.programId === programFilter || (coach.programIds && coach.programIds.includes(programFilter));
          
      // Then apply availability filter
      const passesAvailability = availabilityFilter === "all" 
        ? true 
        : availabilityFilter === "available" 
          ? coach.isPresent !== false
          : coach.isPresent === false;
          
      return passesProgram && passesAvailability;
    });
  }, [availableCoaches, programFilter, availabilityFilter, showCoaches, coachesList]);
  
  // Handle attempt to drag an unavailable coach
  const handleAddToDragArea = (person: PersonData) => {
    if (person.isPresent === false) {
      toast({
        title: "Coach Non Disponibile",
        description: person.absenceReason || "Questo coach non è disponibile",
        variant: "destructive"
      });
      return;
    }
    
    if (onAddToDragArea) {
      onAddToDragArea(person);
    }
  };
  
  // Determine which list to display
  const peopleToShow = showPlayers ? filteredPlayers : filteredCoaches;
  
  return (
    <div className="overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        {peopleToShow.length > 0 ? (
          peopleToShow.map((person) => {
            // Get program color for the card border - similar to PlayerRow component
            const programColor = person.program ? getProgramColor(person.program) : 
                                (person.programId && programs.find(p => p.id === person.programId)?.color) || "#e0e0e0";
            
            return (
              <PersonCard
                key={person.id}
                person={person}
                programs={programs}
                onAddToDragArea={handleAddToDragArea}
              />
            );
          })
        ) : (
          <div className="text-sm text-gray-500 italic p-4 text-center bg-gray-50 rounded-md">
            {programFilter !== "all" 
              ? `Nessun ${showPlayers ? 'giocatore' : 'allenatore'} trovato con questo programma` 
              : showCoaches && availabilityFilter !== "all"
                ? availabilityFilter === "available" 
                  ? "Nessun allenatore disponibile" 
                  : "Nessun allenatore indisponibile"
                : `Nessun ${showPlayers ? 'giocatore' : 'allenatore'} disponibile`}
          </div>
        )}
      </div>
    </div>
  );
}
