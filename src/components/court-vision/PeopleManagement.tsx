
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, User, UserCog, Phone, Mail, Calendar, Tag } from "lucide-react";
import { PersonData, Program } from "./types";
import { PERSON_TYPES } from "./constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useDrag } from "react-dnd";

// Create a draggable person component for the floating menu
function DraggablePerson({ 
  person, 
  programs, 
  onAddToDragArea, 
  onAssignProgram 
}: { 
  person: PersonData, 
  programs: Program[], 
  onAddToDragArea: (person: PersonData) => void,
  onAssignProgram: (personId: string, programId: string) => void
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: person,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [showProgramDialog, setShowProgramDialog] = useState(false);

  return (
    <div className="flex items-center justify-between p-2 mb-1 rounded bg-gray-50 hover:bg-gray-100">
      <div className="flex items-center">
        <div 
          ref={drag}
          className={`w-8 h-8 rounded-full cursor-grab ${isDragging ? "opacity-50" : ""}`}
          style={{ 
            backgroundColor: person.programColor || (person.type === PERSON_TYPES.PLAYER 
              ? "#8B5CF6" // Default purple for players
              : "#1A1F2C"  // Default dark for coaches
            ),
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "medium",
            marginRight: "0.5rem",
            fontSize: "0.75rem"
          }}
        >
          {person.name.substring(0, 2)}
        </div>
        <div>
          <span className="text-sm block">{person.name}</span>
          {person.programId && (
            <span className="text-xs text-gray-500 block">
              {programs.find(p => p.id === person.programId)?.name || ""}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1">
        <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
            >
              <Tag className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Assegna {person.name} a un Programma</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Seleziona Programma</h3>
                <div className="grid grid-cols-1 gap-2">
                  {programs.map(program => (
                    <button
                      key={program.id}
                      className="flex items-center p-2 rounded border border-gray-200 hover:bg-gray-50 text-left"
                      onClick={() => {
                        onAssignProgram(person.id, program.id);
                        setShowProgramDialog(false);
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: program.color }}
                      ></div>
                      <span>{program.name}</span>
                    </button>
                  ))}
                  <button
                    className="flex items-center p-2 rounded border border-gray-200 hover:bg-gray-50 text-left"
                    onClick={() => {
                      onAssignProgram(person.id, "");
                      setShowProgramDialog(false);
                    }}
                  >
                    <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                    <span>Rimuovi dal programma</span>
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
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
  programs: Program[];
  onAddPerson: (person: {name: string, type: string}) => void;
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
  const [newPersonName, setNewPersonName] = useState("");
  const [selectedTab, setSelectedTab] = useState("players");
  const { toast } = useToast();
  
  const handleAddPerson = (type: string) => {
    if (newPersonName.trim() === "") return;
    
    onAddPerson({ 
      name: newPersonName, 
      type 
    });
    
    setNewPersonName("");
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
