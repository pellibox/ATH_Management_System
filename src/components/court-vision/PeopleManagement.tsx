
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, User, UserCog } from "lucide-react";
import { PersonData } from "./types";
import { PERSON_TYPES } from "./constants";

export interface PeopleManagementProps {
  playersList: PersonData[];
  coachesList: PersonData[];
  onAddPerson: (person: {name: string, type: string}) => void;
  onRemovePerson: (id: string) => void;
  onAddToDragArea: (person: PersonData) => void;
}

export function PeopleManagement({ 
  playersList, 
  coachesList, 
  onAddPerson, 
  onRemovePerson,
  onAddToDragArea 
}: PeopleManagementProps) {
  const [newPersonName, setNewPersonName] = useState("");
  const [selectedTab, setSelectedTab] = useState("players");
  
  const handleAddPerson = (type: string) => {
    if (newPersonName.trim() === "") return;
    
    onAddPerson({ 
      name: newPersonName, 
      type 
    });
    
    setNewPersonName("");
  };
  
  const handleAddToDragArea = (person: PersonData) => {
    onAddToDragArea(person);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <UserCog className="h-4 w-4 mr-2" /> People Database
      </h2>
      
      <div className="mb-4">
        <div className="flex space-x-2 mb-3">
          <Input 
            placeholder="Add new person..." 
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            className="text-sm"
          />
          <Button variant="outline" size="sm" onClick={() => handleAddPerson(PERSON_TYPES.PLAYER)}>
            <User className="h-4 w-4 mr-2" />
            Player
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAddPerson(PERSON_TYPES.COACH)}>
            <Users className="h-4 w-4 mr-2" />
            Coach
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="players" onValueChange={setSelectedTab} value={selectedTab}>
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="players" className="text-xs">
            <User className="h-3 w-3 mr-1" /> Players ({playersList.length})
          </TabsTrigger>
          <TabsTrigger value="coaches" className="text-xs">
            <UserCog className="h-3 w-3 mr-1" /> Coaches ({coachesList.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="players" className="max-h-[180px] overflow-y-auto mt-0">
          {playersList.map((player) => (
            <div 
              key={player.id}
              className="flex items-center justify-between p-2 mb-1 rounded bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-ath-red-clay text-white flex items-center justify-center text-xs font-medium mr-2">
                  {player.name.substring(0, 2)}
                </div>
                <span className="text-sm">{player.name}</span>
              </div>
              <div className="flex">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => handleAddToDragArea(player)}
                >
                  <UserPlus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="coaches" className="max-h-[180px] overflow-y-auto mt-0">
          {coachesList.map((coach) => (
            <div 
              key={coach.id}
              className="flex items-center justify-between p-2 mb-1 rounded bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-ath-black text-white flex items-center justify-center text-xs font-medium mr-2">
                  {coach.name.substring(0, 2)}
                </div>
                <span className="text-sm">{coach.name}</span>
              </div>
              <div className="flex">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => handleAddToDragArea(coach)}
                >
                  <UserPlus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
