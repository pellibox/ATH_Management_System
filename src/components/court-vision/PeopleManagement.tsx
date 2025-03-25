
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, User, UserCog, Phone, Mail, Calendar } from "lucide-react";
import { PersonData } from "./types";
import { PERSON_TYPES } from "./constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
            <div 
              key={player.id}
              className="flex items-center justify-between p-2 mb-1 rounded bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-ath-red-clay-dark text-white flex items-center justify-center text-xs font-medium mr-2">
                  {player.name.substring(0, 2)}
                </div>
                <span className="text-sm">{player.name}</span>
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
                      <DialogTitle>Send Schedule to {player.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Schedule Period</h3>
                        <div className="flex gap-2">
                          <Button onClick={() => handleSendSchedule(player)} size="sm">Day</Button>
                          <Button onClick={() => handleSendSchedule(player)} size="sm">Week</Button>
                          <Button onClick={() => handleSendSchedule(player)} size="sm">Month</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Contact Methods</h3>
                        <div className="flex gap-2">
                          <Button onClick={() => handleSendSchedule(player)} variant="outline" size="sm" className="w-full">
                            <Phone className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                          <Button onClick={() => handleSendEmail(player)} variant="outline" size="sm" className="w-full">
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
                      <DialogTitle>Coach: {coach.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Set Objectives</h3>
                        <div className="flex gap-2">
                          <Button size="sm">Daily</Button>
                          <Button size="sm">Weekly</Button>
                          <Button size="sm">Monthly</Button>
                          <Button size="sm">Season</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Notify Players</h3>
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
