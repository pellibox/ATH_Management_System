
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useCourtVision } from "../context/CourtVisionContext";
import { PeopleTabsList } from "./PeopleTabsList";
import { PeopleFilters } from "./PeopleFilters";
import { PeopleTabContent } from "./PeopleTabContent";
import { PersonData } from "../types";

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
  
  // Create wrapper functions to handle type conversion
  const handleAddToDragAreaWrapper = (person: PersonData) => {
    handleAddToDragArea(person.id);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
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
          handleAddToDragArea={handleAddToDragAreaWrapper}
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
          handleAddToDragArea={handleAddToDragAreaWrapper}
        />
      </Tabs>
    </div>
  );
}
