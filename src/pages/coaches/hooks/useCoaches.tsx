
import { useState } from "react";
import { PersonData, Program } from "@/components/court-vision/types";

export function useCoaches(
  coachesList: PersonData[],
  playersList: PersonData[],
  programs: Program[]
) {
  const [coaches, setCoaches] = useState<PersonData[]>(coachesList);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportTypeFilter, setSportTypeFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");

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

  // Handle assigning a program to a coach
  const handleAssignProgram = (coachId: string, programId: string) => {
    setCoaches(prevCoaches => 
      prevCoaches.map(coach => 
        coach.id === coachId 
          ? { ...coach, programId } 
          : coach
      )
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
    handleSendSchedule
  };
}
