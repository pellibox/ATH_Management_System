
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  CourtVisionProvider, 
  useCourtVision 
} from "@/components/court-vision/CourtVisionContext";
import { PersonData } from "@/components/court-vision/types";
import { PERSON_TYPES } from "@/components/court-vision/constants";
import { PlayerCard } from "@/components/court-vision/PlayerCard";

// Create a content component that uses the CourtVision context
function CoachesContent() {
  const { toast } = useToast();
  const { 
    coachesList, 
    programs,
    playersList,
    handleAddPerson,
  } = useCourtVision();
  
  const [coaches, setCoaches] = useState<PersonData[]>(coachesList);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportTypeFilter, setSportTypeFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [newCoach, setNewCoach] = useState<{
    name: string;
    email: string;
    phone: string;
    sportTypes: string[];
  }>({
    name: "",
    email: "",
    phone: "",
    sportTypes: [],
  });
  
  // Update local state when coachesList changes
  useEffect(() => {
    setCoaches(coachesList);
  }, [coachesList]);

  // Get all unique sport types from players and coaches
  const allSportTypes = Array.from(
    new Set([
      ...playersList.flatMap(p => p.sportTypes || []),
      ...coachesList.flatMap(c => c.sportTypes || []),
      "tennis",
      "padel",
      "pickleball",
      "touchtennis"
    ])
  );

  // Filter coaches based on search criteria
  const filteredCoaches = coaches.filter(coach => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coach.email && coach.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Sport type filter
    const matchesSportType = sportTypeFilter === "all" || 
      (coach.sportTypes && coach.sportTypes.includes(sportTypeFilter));
    
    // Program filter
    const matchesProgram = programFilter === "all" || coach.programId === programFilter;
    
    return matchesSearch && matchesSportType && matchesProgram;
  });

  // Handle adding a new coach
  const handleAddCoach = () => {
    if (!newCoach.name) return;
    
    handleAddPerson({
      name: newCoach.name,
      type: PERSON_TYPES.COACH,
      email: newCoach.email,
      phone: newCoach.phone,
      sportTypes: newCoach.sportTypes,
    });
    
    // Reset form
    setNewCoach({
      name: "",
      email: "",
      phone: "",
      sportTypes: [],
    });
    
    toast({
      title: "Allenatore Aggiunto",
      description: `${newCoach.name} è stato aggiunto al database.`,
    });
  };

  // Handle assigning a program to a coach
  const handleAssignProgram = (coachId: string, programId: string) => {
    setCoaches(prevCoaches => 
      prevCoaches.map(coach => 
        coach.id === coachId 
          ? { ...coach, programId } 
          : coach
      )
    );
    
    toast({
      title: "Programma Assegnato",
      description: `Il programma è stato assegnato all'allenatore.`,
    });
  };

  // Handle sending a schedule to a coach
  const handleSendSchedule = (coachId: string, type: "day" | "week" | "month") => {
    const coach = coaches.find(c => c.id === coachId);
    if (!coach) return;
    
    toast({
      title: "Schedule Inviato",
      description: `Lo schedule ${type === "day" ? "giornaliero" : type === "week" ? "settimanale" : "mensile"} è stato inviato a ${coach.name}.`,
    });
  };

  // Handle selecting/deselecting a sport type
  const toggleSportType = (sport: string) => {
    setNewCoach(prev => {
      const sportTypes = prev.sportTypes.includes(sport)
        ? prev.sportTypes.filter(s => s !== sport)
        : [...prev.sportTypes, sport];
      return { ...prev, sportTypes };
    });
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Database Allenatori</h1>
          <p className="text-gray-600 mt-1">Gestisci profili e programmazione degli allenatori</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Cerca allenatori..."
              className="h-10 w-64 rounded-lg bg-white shadow-sm pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Aggiungi Allenatore</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Aggiungi Nuovo Allenatore</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input 
                    value={newCoach.name} 
                    onChange={(e) => setNewCoach({...newCoach, name: e.target.value})}
                    placeholder="Nome Cognome"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email" 
                    value={newCoach.email} 
                    onChange={(e) => setNewCoach({...newCoach, email: e.target.value})}
                    placeholder="allenatore@esempio.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefono</label>
                  <Input 
                    value={newCoach.phone} 
                    onChange={(e) => setNewCoach({...newCoach, phone: e.target.value})}
                    placeholder="+39 123 456 7890"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sport</label>
                  <div className="flex flex-wrap gap-2">
                    {allSportTypes.map(sport => (
                      <Button
                        key={sport}
                        type="button"
                        size="sm"
                        variant={newCoach.sportTypes.includes(sport) ? "default" : "outline"}
                        onClick={() => toggleSportType(sport)}
                        className="capitalize"
                      >
                        {newCoach.sportTypes.includes(sport) && <Check className="mr-1 h-3 w-3" />}
                        {sport}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Annulla</Button>
                </DialogClose>
                <Button onClick={handleAddCoach} disabled={!newCoach.name}>Aggiungi</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 bg-white shadow-sm rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium">Filtri:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={sportTypeFilter} onValueChange={setSportTypeFilter}>
              <SelectTrigger className="w-[180px] text-sm h-9">
                <SelectValue placeholder="Seleziona Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli Sport</SelectItem>
                {allSportTypes.map(sport => (
                  <SelectItem key={sport} value={sport} className="capitalize">{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-[180px] text-sm h-9">
                <SelectValue placeholder="Seleziona Programma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i Programmi</SelectItem>
                {programs.map(program => (
                  <SelectItem key={program.id} value={program.id}>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: program.color }}
                      ></div>
                      {program.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="ml-auto">
            <Button variant="outline" size="sm" className="h-9" onClick={() => {
              setSearchQuery("");
              setSportTypeFilter("all");
              setProgramFilter("all");
            }}>
              Reset Filtri
            </Button>
          </div>
        </div>
      </div>
      
      {/* Coaches list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCoaches.length > 0 ? (
          filteredCoaches.map(coach => (
            <PlayerCard
              key={coach.id}
              player={coach}
              programs={programs}
              onAssignProgram={handleAssignProgram}
              onSendSchedule={handleSendSchedule}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nessun allenatore trovato con i criteri di ricerca specificati
          </div>
        )}
      </div>
    </div>
  );
}

// Main Coaches component that provides the CourtVision context
export default function Coaches() {
  return (
    <CourtVisionProvider>
      <CoachesContent />
    </CourtVisionProvider>
  );
}
