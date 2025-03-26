
import { useState } from "react";
import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Tag, UserPlus, Calendar, Phone, Mail } from "lucide-react";
import { PersonData, Program } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface DraggablePersonProps {
  person: PersonData;
  programs: Program[];
  onAddToDragArea: (person: PersonData) => void;
  onAssignProgram: (personId: string, programId: string) => void;
}

export function DraggablePerson({ 
  person, 
  programs, 
  onAddToDragArea, 
  onAssignProgram 
}: DraggablePersonProps) {
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
            backgroundColor: person.programColor || (person.type === "player" 
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
