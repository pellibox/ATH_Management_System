
import { useState } from "react";
import { User, UserCog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvailablePeople } from "../AvailablePeople";
import { useCourtVision } from "../context/CourtVisionContext";

export function PeopleList() {
  const { 
    people, 
    programs, 
    handleAddPerson, 
    handleAddToDragArea,
    playersList,
    coachesList,
    handleAssignProgram
  } = useCourtVision();
  
  const [activeTab, setActiveTab] = useState("players");
  const [programFilter, setProgramFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <Tabs defaultValue="players" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="players" className="text-xs">
            <User className="h-3 w-3 mr-1" /> <span>Giocatori</span>
          </TabsTrigger>
          <TabsTrigger value="coaches" className="text-xs">
            <UserCog className="h-3 w-3 mr-1" /> <span>Allenatori</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mb-3 flex items-center space-x-2">
          <div className="flex-1">
            <Select value={programFilter} onValueChange={(value) => setProgramFilter(value)}>
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Filtra per programma" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tutti i programmi</SelectItem>
                <SelectItem value="none">Senza programma</SelectItem>
                {programs.map(program => (
                  <SelectItem key={program.id} value={program.id}>
                    <div className="flex items-center">
                      <div 
                        className="h-2 w-2 rounded-full mr-1" 
                        style={{ backgroundColor: program.color }}
                      ></div>
                      {program.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {activeTab === "coaches" && (
            <div className="flex-1">
              <Select value={availabilityFilter} onValueChange={(value) => setAvailabilityFilter(value)}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Filtra per disponibilità" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="available">Disponibili</SelectItem>
                  <SelectItem value="unavailable">Non disponibili</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <TabsContent value="players" className="mt-0">
          <AvailablePeople
            people={people}
            programs={programs}
            onAddPerson={handleAddPerson}
            onAddToDragArea={handleAddToDragArea}
            playersList={playersList}
            coachesList={coachesList}
            programFilter={programFilter}
          />
        </TabsContent>
        
        <TabsContent value="coaches" className="mt-0">
          <AvailablePeople
            people={[]}
            programs={programs}
            onAddPerson={handleAddPerson}
            onAddToDragArea={handleAddToDragArea}
            playersList={[]}
            coachesList={coachesList}
            programFilter={programFilter}
            availabilityFilter={availabilityFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
