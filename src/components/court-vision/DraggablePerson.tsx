
import { PersonData, Program } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal, Plus, Trash2, Tag, Mail, Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PersonCard } from "./PersonCard";
import { CoachAvailabilityActions } from "./CoachAvailabilityActions";
import { PERSON_TYPES } from "./constants";

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
  // Find the person's assigned programs
  const assignedPrograms = person.programIds 
    ? programs.filter(p => person.programIds?.includes(p.id))
    : person.programId 
      ? [programs.find(p => p.id === person.programId)] 
      : [];
      
  // Filter out undefined programs
  const validPrograms = assignedPrograms.filter(Boolean) as Program[];

  return (
    <div className="relative">
      <PersonCard 
        person={person}
        programs={programs}
        onAddToDragArea={onAddToDragArea}
        onRemove={onRemovePerson ? () => onRemovePerson(person.id) : undefined}
      />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 absolute right-2 top-1/2 -translate-y-1/2"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Altre opzioni</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-3">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium mb-1 flex items-center">
                <Tag className="h-3 w-3 mr-1" /> Programmi
              </p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {validPrograms.length > 0 ? (
                  validPrograms.map(program => (
                    <Badge 
                      key={program.id} 
                      variant="outline" 
                      className="text-xs px-1.5 py-0"
                      style={{ 
                        backgroundColor: program.color,
                        color: 'white',
                        fontSize: '0.65rem'
                      }}
                    >
                      {program.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">Nessun programma assegnato</span>
                )}
              </div>
              
              <Select
                value=""
                onValueChange={(value) => onAssignProgram(person.id, value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Assegna programma" />
                </SelectTrigger>
                <SelectContent>
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
            
            {person.type === PERSON_TYPES.COACH && (
              <div>
                <p className="text-xs font-medium mb-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> Disponibilità
                </p>
                
                <CoachAvailabilityActions coach={person} />
              </div>
            )}
            
            {person.email && (
              <div>
                <p className="text-xs font-medium mb-1 flex items-center">
                  <Mail className="h-3 w-3 mr-1" /> Email
                </p>
                <p className="text-xs text-gray-600 break-all">{person.email}</p>
              </div>
            )}
            
            {person.phone && (
              <div>
                <p className="text-xs font-medium mb-1 flex items-center">
                  <Phone className="h-3 w-3 mr-1" /> Telefono
                </p>
                <p className="text-xs text-gray-600">{person.phone}</p>
              </div>
            )}
            
            {onRemovePerson && (
              <div className="pt-2 border-t border-gray-200">
                <Button
                  onClick={() => onRemovePerson(person.id)}
                  variant="destructive"
                  size="sm"
                  className="w-full h-8 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Elimina
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
