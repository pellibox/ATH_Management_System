
import { useDrag } from "react-dnd";
import { PersonData, Program } from "./types";
import { PERSON_TYPES } from "./constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal, Plus, Trash2, Tag, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface DraggablePersonProps {
  person: PersonData;
  programs: Program[];
  onAddToDragArea: (person: PersonData) => void;
  onAssignProgram: (personId: string, programId: string) => void;
  onRemovePerson?: (id: string) => void;
}

export function DraggablePerson({ 
  person, 
  programs,
  onAddToDragArea, 
  onAssignProgram,
  onRemovePerson
}: DraggablePersonProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: person,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const personColor = person.type === PERSON_TYPES.PLAYER
    ? "bg-ath-blue-light text-blue-800"
    : "bg-ath-red-clay-light text-ath-red-clay";

  // Find the person's current program
  const currentProgram = programs.find(p => p.id === person.programId);

  return (
    <div
      ref={drag}
      className={`flex items-center justify-between rounded-md border p-2 my-2 hover:bg-gray-50 ${
        isDragging ? "opacity-50" : ""
      } cursor-move`}
    >
      <div className="flex items-center space-x-2">
        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${personColor}`}>
          {person.type === PERSON_TYPES.PLAYER ? "G" : "A"}
        </div>
        <div>
          <div className="text-sm font-medium">{person.name}</div>
          
          {person.email && (
            <div className="text-xs text-gray-500 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {person.email}
            </div>
          )}
          
          {person.phone && (
            <div className="text-xs text-gray-500 flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {person.phone}
            </div>
          )}
          
          {currentProgram && (
            <Badge 
              variant="outline" 
              className="text-xs mt-1"
              style={{ 
                backgroundColor: currentProgram.color, 
                color: 'white',
                opacity: 0.8 
              }}
            >
              {currentProgram.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <Button
          onClick={() => onAddToDragArea(person)}
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Aggiungi</span>
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Altre opzioni</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2">
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium mb-1 flex items-center">
                  <Tag className="h-3 w-3 mr-1" /> Programma
                </p>
                <Select
                  value={person.programId || ""}
                  onValueChange={(value) => onAssignProgram(person.id, value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Seleziona programma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nessuno</SelectItem>
                    {programs.map((program) => (
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
              
              {onRemovePerson && (
                <Button
                  onClick={() => onRemovePerson(person.id)}
                  variant="destructive"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Elimina
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
