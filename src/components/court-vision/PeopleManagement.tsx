
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, UserCog, Search, AlertCircle } from "lucide-react";
import { PersonData, Program } from "./types";
import { useToast } from "@/hooks/use-toast";
import { PersonCard } from "./PersonCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CoachAvailabilityActions } from "./CoachAvailabilityActions";

export interface PeopleManagementProps {
  playersList: PersonData[];
  coachesList: PersonData[];
  programs: Program[];
  onAddPerson: (person: {
    name: string, 
    type: string, 
    email?: string, 
    phone?: string, 
    sportTypes?: string[]
  }) => void;
  onRemovePerson: (id: string) => void;
  onAddToDragArea: (person: PersonData) => void;
  onAssignProgram: (personId: string, programId: string) => void;
}

export function PeopleManagement({ 
  playersList, 
  coachesList, 
  programs,
  onAddPerson, 
  onRemovePerson,
  onAddToDragArea,
  onAssignProgram
}: PeopleManagementProps) {
  const [selectedTab, setSelectedTab] = useState("players");
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const { toast } = useToast();

  // Apply filters for players
  const filteredPlayers = useMemo(() => {
    return playersList.filter(player => {
      // Search filter
      const matchesSearch = !searchQuery || 
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (player.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        
      // Program filter
      const matchesProgram = programFilter === "all" 
        ? true 
        : programFilter === "none" 
          ? !player.programId && (!player.programIds || player.programIds.length === 0)
          : player.programId === programFilter || (player.programIds && player.programIds.includes(programFilter));
      
      return matchesSearch && matchesProgram;
    });
  }, [playersList, searchQuery, programFilter]);
  
  // Apply filters for coaches
  const filteredCoaches = useMemo(() => {
    return coachesList.filter(coach => {
      // Search filter
      const matchesSearch = !searchQuery || 
        coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (coach.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        
      // Program filter
      const matchesProgram = programFilter === "all" 
        ? true 
        : programFilter === "none" 
          ? !coach.programId && (!coach.programIds || coach.programIds.length === 0)
          : coach.programId === programFilter || (coach.programIds && coach.programIds.includes(programFilter));
          
      // Availability filter
      const matchesAvailability = availabilityFilter === "all" 
        ? true 
        : availabilityFilter === "available" 
          ? coach.isPresent !== false
          : coach.isPresent === false;
      
      return matchesSearch && matchesProgram && matchesAvailability;
    });
  }, [coachesList, searchQuery, programFilter, availabilityFilter]);

  // Only allow adding people to drag area if they're available
  const handleAddPersonToDragArea = (person: PersonData) => {
    if (person.isPresent === false) {
      toast({
        title: "Coach Non Disponibile",
        description: person.absenceReason || "Questo coach non è disponibile",
        variant: "destructive"
      });
      return;
    }
    
    onAddToDragArea(person);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <UserCog className="h-4 w-4 mr-2" /> Database Persone
      </h2>
      
      <div className="mb-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Cerca per nome o email..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm" 
          />
        </div>
      </div>
      
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
            <User className="h-3 w-3 mr-1" /> <span>Giocatori ({filteredPlayers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="coaches" className="text-xs">
            <UserCog className="h-3 w-3 mr-1" /> <span>Allenatori ({filteredCoaches.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="players" className="max-h-[300px] overflow-y-auto mt-0">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <PersonCard
                key={player.id} 
                person={player} 
                programs={programs}
                onAddToDragArea={handleAddPersonToDragArea}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 italic p-4 text-center bg-gray-50 rounded-md">
              {searchQuery 
                ? "Nessun giocatore trovato" 
                : programFilter !== "all" 
                  ? "Nessun giocatore con questo programma" 
                  : "Non ci sono giocatori nel database"}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="coaches" className="max-h-[300px] overflow-y-auto mt-0">
          {filteredCoaches.length > 0 ? (
            filteredCoaches.map((coach) => (
              <div key={coach.id} className="mb-2">
                <PersonCard
                  person={coach}
                  programs={programs}
                  onAddToDragArea={handleAddPersonToDragArea}
                />
                {selectedTab === "coaches" && (
                  <div className="mt-1 ml-10">
                    <CoachAvailabilityActions coach={coach} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic p-4 text-center bg-gray-50 rounded-md">
              {searchQuery 
                ? "Nessun allenatore trovato" 
                : programFilter !== "all" 
                  ? "Nessun allenatore con questo programma" 
                  : availabilityFilter !== "all"
                    ? availabilityFilter === "available" 
                      ? "Nessun allenatore disponibile" 
                      : "Nessun allenatore indisponibile"
                    : "Non ci sono allenatori nel database"}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
