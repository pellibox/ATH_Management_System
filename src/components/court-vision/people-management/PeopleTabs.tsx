
import { useState } from "react";
import { User, UserCog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonData, Program } from "../types";
import { PeopleList } from "./PeopleList";

interface PeopleTabsProps {
  playersList: PersonData[];
  coachesList: PersonData[];
  programs: Program[];
  searchQuery: string;
  programFilter: string;
  availabilityFilter: string;
  onAddToDragArea: (person: PersonData) => void;
}

export function PeopleTabs({ 
  playersList, 
  coachesList, 
  programs, 
  searchQuery, 
  programFilter, 
  availabilityFilter,
  onAddToDragArea 
}: PeopleTabsProps) {
  const [selectedTab, setSelectedTab] = useState("players");

  return (
    <Tabs defaultValue="players" onValueChange={setSelectedTab} value={selectedTab}>
      <TabsList className="grid w-full grid-cols-2 mb-3">
        <TabsTrigger value="players" className="text-xs">
          <User className="h-3 w-3 mr-1" /> <span>Giocatori ({playersList.length})</span>
        </TabsTrigger>
        <TabsTrigger value="coaches" className="text-xs">
          <UserCog className="h-3 w-3 mr-1" /> <span>Allenatori ({coachesList.length})</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="players">
        <PeopleList
          people={playersList}
          programs={programs}
          searchQuery={searchQuery}
          programFilter={programFilter}
          onAddToDragArea={onAddToDragArea}
        />
      </TabsContent>
      
      <TabsContent value="coaches">
        <PeopleList
          people={coachesList}
          programs={programs}
          searchQuery={searchQuery}
          programFilter={programFilter}
          availabilityFilter={availabilityFilter}
          onAddToDragArea={onAddToDragArea}
          isCoachesList={true}
        />
      </TabsContent>
    </Tabs>
  );
}
