
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
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PersonCardProps {
  person: PersonData;
  programs: Program[];
  onRemove?: () => void;
  onAddToDragArea?: (person: PersonData) => void;
}

export function PersonCard({ person, programs = [], onRemove, onAddToDragArea }: PersonCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: {
      ...person,
      // Set default duration based on program if not already set
      durationHours: person.durationHours || (person.programId ? 1.5 : 1)
    },
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
  
  // Get program color for the card border - use the same function as PlayerRow
  const programColor = getPersonProgramColor(person);

  // Get assigned programs
  const validPrograms = getAssignedPrograms(person, programs);
      
  // Determine if person has assigned programs
  const hasProgram = validPrograms.length > 0;
  
  // Determine if the coach is unavailable
  const isUnavailable = isPersonUnavailable(person);
  
  // Calculate program-based default duration and daily limits
  const getDefaultDuration = () => {
    if (!person.programId) return 1;
    // Different programs have different default durations
    const programDurations: Record<string, number> = {
      "PRO": 2,
      "ELITE": 1.5,
      "JUNIOR": 1.5,
      "BASIC": 1,
    };
    return programDurations[person.programId] || 1;
  };
  
  const getDailyLimit = () => {
    if (!person.programId) return 2;
    // Different programs have different daily limits
    const programLimits: Record<string, number> = {
      "PRO": 4,
      "ELITE": 3,
      "JUNIOR": 2.5,
      "BASIC": 2,
    };
    return programLimits[person.programId] || 2;
  };
  
  const defaultDuration = getDefaultDuration();
  const dailyLimit = getDailyLimit();
  const hoursAssigned = person.hoursAssigned || 0;
  const remainingHours = Math.max(0, dailyLimit - hoursAssigned);

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
              
              {/* Duration and hours information */}
              {person.type === "player" && person.programId && (
                <div className="flex items-center space-x-1 mt-1">
                  <Badge 
                    variant="outline" 
                    className="text-[9px] px-1 py-0 h-4 flex items-center bg-gray-50"
                  >
                    <Clock className="h-2.5 w-2.5 mr-0.5" />
                    {defaultDuration}h
                  </Badge>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-[9px] px-1 py-0 h-4 flex items-center ${
                      remainingHours > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {remainingHours}/{dailyLimit}h
                  </Badge>
                </div>
              )}
              
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
