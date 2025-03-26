
import { useState } from "react";
import { UserCog } from "lucide-react";
import { PersonData, Program } from "../types";
import { SearchBar } from "./SearchBar";
import { PeopleFilters } from "./PeopleFilters";
import { PeopleTabs } from "./PeopleTabs";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <UserCog className="h-4 w-4 mr-2" /> Database Persone
      </h2>
      
      <SearchBar 
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      
      <PeopleFilters 
        programs={programs}
        programFilter={programFilter}
        setProgramFilter={setProgramFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        showAvailabilityFilter={true}
      />
      
      <PeopleTabs 
        playersList={playersList}
        coachesList={coachesList}
        programs={programs}
        searchQuery={searchQuery}
        programFilter={programFilter}
        availabilityFilter={availabilityFilter}
        onAddToDragArea={onAddToDragArea}
      />
    </div>
  );
}
