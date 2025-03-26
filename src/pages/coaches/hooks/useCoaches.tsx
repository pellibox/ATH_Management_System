
import { useState } from "react";
import { PersonData, Program } from "@/components/court-vision/types";
import { CoachAvailabilityEvent } from "@/contexts/programs/types";
import { EXCLUDED_PROGRAMS, EXCLUDED_PROGRAM_NAMES } from "@/contexts/programs/useProgramsState";

export function useCoaches(
  coachesList: PersonData[],
  playersList: PersonData[],
  programs: Program[]
) {
  // Filtriamo i programmi per rimuovere quelli esclusi
  const filteredPrograms = programs.filter(program => 
    !EXCLUDED_PROGRAMS.includes(program.id) && 
    !EXCLUDED_PROGRAM_NAMES.includes(program.name)
  );

  const [coaches, setCoaches] = useState<PersonData[]>(coachesList);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportTypeFilter, setSportTypeFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [availabilityEvents, setAvailabilityEvents] = useState<CoachAvailabilityEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<"week" | "day" | "month">("week");

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
    
    // Program filter - now checks if any of the coach's programs match
    const coachProgramIds = coach.programIds || (coach.programId ? [coach.programId] : []);
    
    // Filtra anche i programIds dell'allenatore per rimuovere quelli esclusi
    const validCoachProgramIds = coachProgramIds.filter(id => 
      !EXCLUDED_PROGRAMS.includes(id)
    );
    
    const matchesProgram = programFilter === "all" || 
      validCoachProgramIds.includes(programFilter);
    
    return matchesSearch && matchesSportType && matchesProgram;
  });

  // Handle assigning a program to a coach (now supporting multiple programs)
  const handleAssignProgram = (coachId: string, programId: string) => {
    // Non permettere l'assegnazione di programmi esclusi
    if (EXCLUDED_PROGRAMS.includes(programId)) {
      console.log(`Programma ${programId} è escluso e non può essere assegnato`);
      return;
    }
    
    setCoaches(prevCoaches => 
      prevCoaches.map(coach => {
        if (coach.id === coachId) {
          // Initialize programIds array if it doesn't exist
          const currentProgramIds = coach.programIds || (coach.programId ? [coach.programId] : []);
          
          // Add the program if not already assigned, otherwise remove it (toggle behavior)
          const newProgramIds = currentProgramIds.includes(programId)
            ? currentProgramIds.filter(id => id !== programId)
            : [...currentProgramIds, programId];
            
          return { 
            ...coach, 
            programIds: newProgramIds
          };
        }
        return coach;
      })
    );
  };

  // Handle adding a new availability event
  const handleAddAvailabilityEvent = (event: CoachAvailabilityEvent) => {
    setAvailabilityEvents(prev => [...prev, event]);
  };

  // Handle removing an availability event
  const handleRemoveAvailabilityEvent = (eventId: string) => {
    setAvailabilityEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // Handle updating an availability event
  const handleUpdateAvailabilityEvent = (eventId: string, updatedEvent: Partial<CoachAvailabilityEvent>) => {
    setAvailabilityEvents(prev => 
      prev.map(event => event.id === eventId ? { ...event, ...updatedEvent } : event)
    );
  };

  // Handle sending a schedule to a coach
  const handleSendSchedule = (coachId: string, type: "day" | "week" | "month") => {
    // Implementation retained from original component
  };

  return {
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
    setCurrentView,
    filteredPrograms  // Making sure we expose the filtered programs
  };
}
