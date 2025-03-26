
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, UserCog } from "lucide-react";
import { PersonData, Program } from "./types";
import { PERSON_TYPES } from "./constants";
import { useToast } from "@/hooks/use-toast";
import { DraggablePerson } from "./DraggablePerson";
import { AddPersonForm } from "./AddPersonForm";

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
  const [selectedTab, setSelectedTab] = useState("players");
  const { toast } = useToast();

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <UserCog className="h-4 w-4 mr-2" /> Database Persone
      </h2>
      
      <AddPersonForm onAddPerson={onAddPerson} />
      
      <Tabs defaultValue="players" onValueChange={setSelectedTab} value={selectedTab}>
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="players" className="text-xs">
            <User className="h-3 w-3 mr-1" /> <span className="truncate">Giocatori ({playersList.length})</span>
          </TabsTrigger>
          <TabsTrigger value="coaches" className="text-xs">
            <UserCog className="h-3 w-3 mr-1" /> <span className="truncate">Allenatori ({coachesList.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="players" className="max-h-[180px] overflow-y-auto mt-0">
          {playersList.map((player) => (
            <DraggablePerson 
              key={player.id} 
              person={player} 
              programs={programs}
              onAddToDragArea={onAddToDragArea}
              onAssignProgram={onAssignProgram}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="coaches" className="max-h-[180px] overflow-y-auto mt-0">
          {coachesList.map((coach) => (
            <DraggablePerson 
              key={coach.id} 
              person={coach}
              programs={programs}
              onAddToDragArea={onAddToDragArea}
              onAssignProgram={onAssignProgram}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
