
import { useDrag } from "react-dnd";
import { 
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PersonData, Program } from "./types";
import { useToast } from "@/hooks/use-toast";
import { getPersonProgramColor, getAssignedPrograms, isPersonUnavailable } from "./utils/personUtils";
import { PersonAvatar } from "./person-card/PersonAvatar";
import { ProgramBadges } from "./person-card/ProgramBadges";
import { AbsenceIndicator } from "./person-card/AbsenceIndicator";
import { CardActions } from "./person-card/CardActions";
import { PersonContextMenu } from "./person-card/PersonContextMenu";

interface PersonCardProps {
  person: PersonData;
  programs: Program[];
  onRemove?: () => void;
  onAddToDragArea?: (person: PersonData) => void;
}

export function PersonCard({ person, programs = [], onRemove, onAddToDragArea }: PersonCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: person,
    canDrag: person.isPresent !== false, 
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  const { toast } = useToast();

  const handleAddToDragArea = () => {
    if (person.isPresent === false) {
      toast({
        title: "Coach Non Disponibile",
        description: person.absenceReason || "Questo coach non è disponibile",
        variant: "destructive"
      });
      return;
    }
    
    if (onAddToDragArea) {
      onAddToDragArea(person);
    }
  };
  
  // Get program color for the card border
  const programColor = getPersonProgramColor(person);

  // Get assigned programs
  const validPrograms = getAssignedPrograms(person, programs);
      
  // Determine if person has assigned programs
  const hasProgram = validPrograms.length > 0;
  
  // Determine if the coach is unavailable
  const isUnavailable = isPersonUnavailable(person);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={drag}
          className={`flex items-center justify-between p-2 my-1 ${
            isUnavailable 
              ? "bg-gray-100 border-red-200" 
              : "bg-gray-50 hover:bg-gray-100"
          } rounded-md border border-gray-200 ${
            isDragging ? "opacity-50" : ""
          } transition-colors ${isUnavailable ? "cursor-not-allowed" : "cursor-grab"}`}
          style={{ 
            borderLeftWidth: '4px', 
            borderLeftColor: programColor 
          }}
        >
          <div className="flex items-center space-x-2">
            {/* Avatar with color from primary program */}
            <PersonAvatar 
              person={person} 
              hasProgram={hasProgram} 
              programColor={validPrograms[0]?.color} 
            />
            
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[150px]">{person.name}</span>
              
              {/* Show email if available */}
              {person.email && (
                <span className="text-xs text-gray-500 truncate max-w-[150px]">
                  {person.email}
                </span>
              )}
              
              {/* Program badges */}
              <ProgramBadges programs={validPrograms} />
              
              {/* Absence reason */}
              <AbsenceIndicator person={person} />
            </div>
          </div>
          
          {/* Card actions */}
          <CardActions 
            onAddToDragArea={onAddToDragArea ? handleAddToDragArea : undefined}
            onRemove={onRemove}
            person={person}
            isUnavailable={isUnavailable}
          />
        </div>
      </ContextMenuTrigger>
      
      {/* Context menu */}
      <PersonContextMenu 
        person={person}
        validPrograms={validPrograms}
        onAddToDragArea={onAddToDragArea ? handleAddToDragArea : undefined}
        onRemove={onRemove}
        isUnavailable={isUnavailable}
      />
    </ContextMenu>
  );
}
