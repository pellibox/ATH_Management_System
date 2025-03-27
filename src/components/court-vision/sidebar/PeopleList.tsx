
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useCourtVision } from "../context/CourtVisionContext";
import { PeopleTabsList } from "./PeopleTabsList";
import { PeopleFilters } from "./PeopleFilters";
import { PeopleTabContent } from "./PeopleTabContent";
import { ProgramLegend } from "../ProgramLegend";

export function PeopleList() {
  const { 
    people, 
    programs, 
    handleAddPerson, 
    handleAddToDragArea,
    playersList,
    coachesList
  } = useCourtVision();
  
  const [activeTab, setActiveTab] = useState("players");
  const [programFilter, setProgramFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
      {/* Add program legend at the top */}
      <ProgramLegend programs={programs} />
      
      <Tabs defaultValue="players" onValueChange={setActiveTab} value={activeTab}>
        <PeopleTabsList activeTab={activeTab} />
        
        <PeopleFilters 
          programFilter={programFilter}
          setProgramFilter={setProgramFilter}
          programs={programs}
          activeTab={activeTab}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
        />
        
        <PeopleTabContent 
          tabValue="players"
          people={people}
          programs={programs}
          playersList={playersList}
          coachesList={coachesList}
          programFilter={programFilter}
          handleAddPerson={handleAddPerson}
          handleAddToDragArea={handleAddToDragArea}
        />
        
        <PeopleTabContent 
          tabValue="coaches"
          people={[]}
          programs={programs}
          playersList={[]}
          coachesList={coachesList}
          programFilter={programFilter}
          availabilityFilter={availabilityFilter}
          handleAddPerson={handleAddPerson}
          handleAddToDragArea={handleAddToDragArea}
        />
      </Tabs>
    </div>
  );
}
