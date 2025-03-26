
import { TabsContent } from "@/components/ui/tabs";
import { AvailablePeople } from "../AvailablePeople";
import { PersonData, Program } from "../types";

interface PeopleTabContentProps {
  tabValue: "players" | "coaches";
  people: PersonData[];
  programs: Program[];
  playersList: PersonData[];
  coachesList: PersonData[];
  programFilter: string;
  availabilityFilter?: string;
  handleAddPerson: (personData: {name: string, type: string, email?: string, phone?: string, sportTypes?: string[]}) => void;
  handleAddToDragArea: (person: PersonData) => void;
}

export function PeopleTabContent({
  tabValue,
  people,
  programs,
  playersList,
  coachesList,
  programFilter,
  availabilityFilter = "all",
  handleAddPerson,
  handleAddToDragArea
}: PeopleTabContentProps) {
  return (
    <TabsContent value={tabValue} className="mt-0">
      <AvailablePeople
        people={tabValue === "players" ? people : []}
        programs={programs}
        onAddPerson={handleAddPerson}
        onAddToDragArea={handleAddToDragArea}
        playersList={tabValue === "players" ? playersList : []}
        coachesList={coachesList}
        programFilter={programFilter}
        availabilityFilter={tabValue === "coaches" ? availabilityFilter : undefined}
      />
    </TabsContent>
  );
}
