
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useCourtVision } from "@/components/court-vision/CourtVisionContext";
import { CoachFilters } from "./components/CoachFilters";
import { AddCoachDialog } from "./components/AddCoachDialog";
import { CoachesList } from "./components/CoachesList";
import { PersonData } from "@/components/court-vision/types";
import { PERSON_TYPES } from "@/components/court-vision/constants";
import { useCoaches } from "./hooks/useCoaches";

export function CoachesContent() {
  const { toast } = useToast();
  const { 
    coachesList, 
    programs,
    playersList,
    handleAddPerson,
  } = useCourtVision();
  
  const {
    coaches,
    setCoaches,
    searchQuery,
    setSearchQuery,
    sportTypeFilter,
    setSportTypeFilter,
    programFilter,
    setProgramFilter,
    filteredCoaches,
    allSportTypes,
    handleAssignProgram,
    handleSendSchedule,
  } = useCoaches(coachesList, playersList, programs);

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
  }, [coachesList, setCoaches]);

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
          
          <AddCoachDialog 
            newCoach={newCoach}
            setNewCoach={setNewCoach}
            handleAddCoach={handleAddCoach}
            toggleSportType={toggleSportType}
            allSportTypes={allSportTypes}
          />
        </div>
      </div>
      
      <CoachFilters 
        sportTypeFilter={sportTypeFilter}
        setSportTypeFilter={setSportTypeFilter}
        programFilter={programFilter}
        setProgramFilter={setProgramFilter}
        setSearchQuery={setSearchQuery}
        allSportTypes={allSportTypes}
        programs={programs}
      />
      
      <CoachesList 
        filteredCoaches={filteredCoaches}
        programs={programs}
        handleAssignProgram={handleAssignProgram}
        handleSendSchedule={handleSendSchedule}
      />
    </div>
  );
}
