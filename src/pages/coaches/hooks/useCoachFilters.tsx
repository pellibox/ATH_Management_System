
import { useState, useMemo } from "react";
import { PersonData } from "@/components/court-vision/types";

export function useCoachFilters(
  coaches: PersonData[],
  allSportTypes: string[]
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sportTypeFilter, setSportTypeFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");

  // Filter coaches based on search criteria
  const filteredCoaches = useMemo(() => {
    return coaches.filter(coach => {
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
        !["tennis-academy", "padel-club", "junior-development", "high-performance"].includes(id)
      );
      
      const matchesProgram = programFilter === "all" || 
        validCoachProgramIds.includes(programFilter);
      
      return matchesSearch && matchesSportType && matchesProgram;
    });
  }, [coaches, searchQuery, sportTypeFilter, programFilter]);

  return {
    searchQuery,
    setSearchQuery,
    sportTypeFilter,
    setSportTypeFilter,
    programFilter,
    setProgramFilter,
    filteredCoaches
  };
}
