
import { useState } from "react";
import { Users, User, UserCog } from "lucide-react";
import { Person } from "./Person";
import { PersonData, Program } from "./types";
import { PERSON_TYPES } from "./constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface AvailablePeopleProps {
  people: PersonData[];
  programs?: Program[];
  onAddPerson?: (person: {name: string, type: string}) => void;
  onRemovePerson?: (id: string) => void;
  onDrop?: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onAddToDragArea?: (person: PersonData) => void;
  playersList?: PersonData[];
  coachesList?: PersonData[];
}

export function AvailablePeople({ 
  people, 
  programs = [], 
  onAddPerson,
  onRemovePerson,
  onDrop,
  onAddToDragArea,
  playersList = [],
  coachesList = []
}: AvailablePeopleProps) {
  const [selectedTab, setSelectedTab] = useState("players");
  
  // Filter available people by type
  const availablePlayers = people.filter(person => person.type === PERSON_TYPES.PLAYER);
  const availableCoaches = people.filter(person => person.type === PERSON_TYPES.COACH);
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center truncate">
        <Users className="h-4 w-4 mr-2 flex-shrink-0" /> 
        <span className="truncate">Persone Disponibili</span>
      </h2>
      
      <Tabs defaultValue="players" onValueChange={setSelectedTab} value={selectedTab}>
        <TabsList className="grid w-full grid-cols-2 mb-3">
          <TabsTrigger value="players" className="text-xs">
            <User className="h-3 w-3 mr-1" /> <span className="truncate">Giocatori ({availablePlayers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="coaches" className="text-xs">
            <UserCog className="h-3 w-3 mr-1" /> <span className="truncate">Allenatori ({availableCoaches.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="players" className="max-h-[180px] overflow-y-auto mt-0">
          {availablePlayers.length > 0 ? (
            availablePlayers.map((person) => (
              <Person
                key={person.id}
                person={person}
                onRemove={onRemovePerson ? () => onRemovePerson(person.id) : undefined}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 italic p-2">
              Tutti i giocatori sono assegnati ai campi
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="coaches" className="max-h-[180px] overflow-y-auto mt-0">
          {availableCoaches.length > 0 ? (
            availableCoaches.map((person) => (
              <Person
                key={person.id}
                person={person}
                onRemove={onRemovePerson ? () => onRemovePerson(person.id) : undefined}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 italic p-2">
              Tutti gli allenatori sono assegnati ai campi
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
