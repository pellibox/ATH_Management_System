
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Check, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useCourtVision } from "@/components/court-vision/CourtVisionContext";
import { CoachFilters } from "./components/CoachFilters";
import { AddCoachDialog } from "./components/AddCoachDialog";
import { CoachesList } from "./components/CoachesList";
import { PersonData } from "@/components/court-vision/types";
import { PERSON_TYPES } from "@/components/court-vision/constants";
import { useCoaches } from "./hooks/useCoaches";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoachAvailabilityCalendar } from "./components/CoachAvailabilityCalendar";

export function CoachesContent() {
  const { toast } = useToast();
  const { 
    coachesList, 
    programs,
    playersList,
    handleAddPerson,
  } = useCourtVision();
  
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [selectedCoach, setSelectedCoach] = useState<PersonData | null>(null);
  
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
    availabilityEvents,
    handleAddAvailabilityEvent,
    handleRemoveAvailabilityEvent,
    handleUpdateAvailabilityEvent,
    selectedDate,
    setSelectedDate,
    currentView,
    setCurrentView
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
          <p className="text-gray-600 mt-1">Gestisci profili, programmazione e disponibilità degli allenatori</p>
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
      
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="mb-6">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Lista Allenatori
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Calendario Disponibilità
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <TabsContent value="list" className="mt-0">
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
          onSelectCoach={(coach) => {
            setSelectedCoach(coach);
            setActiveTab("calendar");
          }}
        />
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-0">
        {selectedCoach ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ath-blue" />
                Disponibilità: {selectedCoach.name}
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCoach(null)}
              >
                Cambia Allenatore
              </Button>
            </div>
            
            <CoachAvailabilityCalendar
              coachId={selectedCoach.id}
              coachName={selectedCoach.name}
              availabilityEvents={availabilityEvents}
              onAddEvent={handleAddAvailabilityEvent}
              onRemoveEvent={handleRemoveAvailabilityEvent}
              onUpdateEvent={handleUpdateAvailabilityEvent}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Seleziona un Allenatore</h3>
            <p className="text-gray-500 mb-6">
              Seleziona un allenatore dalla lista per visualizzare e modificare la sua disponibilità
            </p>
            <Button onClick={() => setActiveTab("list")}>
              Vai alla Lista Allenatori
            </Button>
          </div>
        )}
      </TabsContent>
    </div>
  );
}
