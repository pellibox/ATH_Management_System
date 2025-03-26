
import { useState, useMemo } from "react";
import { Users, User, UserCog, Plus, Filter, AlertCircle, Tag } from "lucide-react";
import { PersonCard } from "./PersonCard";
import { PersonData, Program } from "./types";
import { PERSON_TYPES } from "./constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export interface AvailablePeopleProps {
  people: PersonData[];
  programs: Program[];
  onAddPerson?: (person: {name: string, type: string, email?: string, phone?: string, sportTypes?: string[]}) => void;
  onRemovePerson?: (id: string) => void;
  onDrop?: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onAddToDragArea?: (person: PersonData) => void;
  playersList?: PersonData[];
  coachesList?: PersonData[];
}

export function AvailablePeople({ 
  people, 
  programs = [], 
  onAddPerson,
  onRemovePerson,
  onDrop,
  onAddToDragArea,
  playersList = [],
  coachesList = []
}: AvailablePeopleProps) {
  const [selectedTab, setSelectedTab] = useState("players");
  const [programFilter, setProgramFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const { toast } = useToast();
  
  // Filter available people by type
  const availablePlayers = people.filter(person => person.type === PERSON_TYPES.PLAYER);
  
  // For coaches, we'll show ALL coaches, not just those in the available people list
  // This ensures coaches are always available for scheduling across multiple time slots
  const availableCoaches = coachesList;
  
  // Apply program filter to both lists
  const filteredPlayers = useMemo(() => {
    return availablePlayers.filter(player => {
      if (programFilter === "all") return true;
      if (programFilter === "none") return !player.programId && (!player.programIds || player.programIds.length === 0);
      return player.programId === programFilter || (player.programIds && player.programIds.includes(programFilter));
    });
  }, [availablePlayers, programFilter]);
  
  const filteredCoaches = useMemo(() => {
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
  }, [availableCoaches, programFilter, availabilityFilter]);
  
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
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center truncate">
        <Users className="h-4 w-4 mr-2 flex-shrink-0" /> 
        <span className="truncate">Persone Disponibili</span>
      </h2>
      
      <div className="mb-3 flex items-center space-x-2">
        <div className="flex-1">
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Filtra per programma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i programmi</SelectItem>
              <SelectItem value="none">Senza programma</SelectItem>
              {programs.map(program => (
                <SelectItem key={program.id} value={program.id}>
                  <div className="flex items-center">
                    <div 
                      className="h-2 w-2 rounded-full mr-1" 
                      style={{ backgroundColor: program.color }}
                    ></div>
                    {program.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedTab === "coaches" && (
          <div className="flex-1">
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Filtra per disponibilità" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="available">Disponibili</SelectItem>
                <SelectItem value="unavailable">Non disponibili</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="players" onValueChange={setSelectedTab} value={selectedTab}>
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="players" className="text-xs">
            <User className="h-3 w-3 mr-1" /> <span className="truncate">Giocatori ({filteredPlayers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="coaches" className="text-xs">
            <UserCog className="h-3 w-3 mr-1" /> <span className="truncate">Allenatori ({filteredCoaches.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="players" className="max-h-[280px] overflow-y-auto mt-0">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                programs={programs}
                onRemove={onRemovePerson ? () => onRemovePerson(person.id) : undefined}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 italic p-4 text-center bg-gray-50 rounded-md">
              {programFilter !== "all" 
                ? "Nessun giocatore trovato con questo programma" 
                : "Tutti i giocatori sono assegnati ai campi"}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="coaches" className="max-h-[280px] overflow-y-auto mt-0">
          {filteredCoaches.length > 0 ? (
            filteredCoaches.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                programs={programs}
                // Coaches should always remain in the list for reuse
                onRemove={undefined}
                onAddToDragArea={handleAddToDragArea}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 italic p-4 text-center bg-gray-50 rounded-md">
              {programFilter !== "all" 
                ? "Nessun allenatore trovato con questo programma" 
                : availabilityFilter !== "all"
                  ? availabilityFilter === "available" 
                    ? "Nessun allenatore disponibile" 
                    : "Nessun allenatore indisponibile"
                  : "Non ci sono allenatori"}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Program legend at the bottom */}
      {programs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2 flex items-center">
            <Tag className="h-3 w-3 mr-1" /> Legenda programmi:
          </p>
          <div className="flex flex-wrap gap-1">
            {programs.map(program => (
              <Badge 
                key={program.id} 
                variant="outline" 
                className="text-xs px-1.5 py-0.5"
                style={{ 
                  backgroundColor: program.color,
                  color: 'white',
                  opacity: 0.8
                }}
              >
                {program.name}
              </Badge>
            ))}
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700">
              Senza programma
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
