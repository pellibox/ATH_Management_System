
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, User, UserCog, Phone, Mail, Calendar } from "lucide-react";
import { PersonData } from "./types";
import { PERSON_TYPES } from "./constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useDrag } from "react-dnd";

// Create a draggable person component for the floating menu
function DraggablePerson({ person, onAddToDragArea }: { person: PersonData, onAddToDragArea: (person: PersonData) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: person,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div className="flex items-center justify-between p-2 mb-1 rounded bg-gray-50 hover:bg-gray-100">
      <div className="flex items-center">
        <div 
          ref={drag}
          className={`w-6 h-6 rounded-full cursor-grab ${isDragging ? "opacity-50" : ""} ${
            person.type === PERSON_TYPES.PLAYER 
              ? "bg-ath-red-clay-dark text-white" 
              : "bg-ath-black text-white"
          } flex items-center justify-center text-xs font-medium mr-2`}
        >
          {person.name.substring(0, 2)}
        </div>
        <span className="text-sm">{person.name}</span>
      </div>
      <div className="flex gap-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
            >
              <Calendar className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Send Schedule to {person.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Schedule Period</h3>
                <div className="flex gap-2">
                  <Button size="sm">Day</Button>
                  <Button size="sm">Week</Button>
                  <Button size="sm">Month</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Contact Methods</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0"
          onClick={() => onAddToDragArea(person)}
        >
          <UserPlus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

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
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);
  const { toast } = useToast();
  
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

  const handleSendSchedule = (person: PersonData) => {
    // Simulate sending a schedule via WhatsApp
    toast({
      title: "Schedule Sent",
      description: `Schedule has been sent to ${person.name} via WhatsApp.`,
    });
  };

  const handleSendEmail = (person: PersonData) => {
    // Simulate sending a schedule via Email
    toast({
      title: "Email Sent",
      description: `Schedule has been sent to ${person.name} via Email.`,
    });
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
            <DraggablePerson key={player.id} person={player} onAddToDragArea={handleAddToDragArea} />
          ))}
        </TabsContent>
        
        <TabsContent value="coaches" className="max-h-[180px] overflow-y-auto mt-0">
          {coachesList.map((coach) => (
            <DraggablePerson key={coach.id} person={coach} onAddToDragArea={handleAddToDragArea} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
