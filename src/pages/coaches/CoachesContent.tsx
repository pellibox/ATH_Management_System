
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCourtVision } from "@/components/court-vision/CourtVisionContext";
import { PERSON_TYPES } from "@/components/court-vision/constants";
import { useCoaches } from "./hooks/useCoaches";
import { 
  CoachesHeader, 
  CoachesTabsContent 
} from "./components";
import { EXCLUDED_PROGRAMS, EXCLUDED_PROGRAM_NAMES } from "@/contexts/programs/useProgramsState";

export function CoachesContent() {
  const { toast } = useToast();
  const { 
    coachesList, 
    programs: allPrograms,
    playersList,
    handleAddPerson,
  } = useCourtVision();
  
  // Filter out excluded programs
  const programs = allPrograms.filter(program => 
    !EXCLUDED_PROGRAMS.includes(program.id) && 
    !EXCLUDED_PROGRAM_NAMES.includes(program.name)
  );
  
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

  const handleAddCoach = () => {
    if (!newCoach.name) return;
    
    handleAddPerson({
      name: newCoach.name,
      type: PERSON_TYPES.COACH,
      email: newCoach.email,
      phone: newCoach.phone,
      sportTypes: newCoach.sportTypes,
    });
    
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
      <CoachesHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        newCoach={newCoach}
        setNewCoach={setNewCoach}
        handleAddCoach={handleAddCoach}
        toggleSportType={toggleSportType}
        allSportTypes={allSportTypes}
      />
      
      <CoachesTabsContent
        sportTypeFilter={sportTypeFilter}
        setSportTypeFilter={setSportTypeFilter}
        programFilter={programFilter}
        setProgramFilter={setProgramFilter}
        setSearchQuery={setSearchQuery}
        filteredCoaches={filteredCoaches}
        allSportTypes={allSportTypes}
        programs={programs}
        handleAssignProgram={handleAssignProgram}
        handleSendSchedule={handleSendSchedule}
        availabilityEvents={availabilityEvents}
        handleAddAvailabilityEvent={handleAddAvailabilityEvent}
        handleRemoveAvailabilityEvent={handleRemoveAvailabilityEvent}
        handleUpdateAvailabilityEvent={handleUpdateAvailabilityEvent}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
    </div>
  );
}
