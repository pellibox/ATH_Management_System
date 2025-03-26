
import { ProgramFilter } from "./filters/ProgramFilter";
import { AvailabilityFilter } from "./filters/AvailabilityFilter";
import { Program } from "../types";

interface PeopleFiltersProps {
  programFilter: string;
  setProgramFilter: (value: string) => void;
  programs: Program[];
  activeTab: string;
  availabilityFilter: string;
  setAvailabilityFilter: (value: string) => void;
}

export function PeopleFilters({ 
  programFilter, 
  setProgramFilter, 
  programs, 
  activeTab,
  availabilityFilter,
  setAvailabilityFilter
}: PeopleFiltersProps) {
  return (
    <div className="mb-3 flex items-center space-x-2">
      <ProgramFilter 
        programs={programs} 
        programFilter={programFilter} 
        setProgramFilter={setProgramFilter} 
      />
      
      {activeTab === "coaches" && (
        <AvailabilityFilter 
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
        />
      )}
    </div>
  );
}
