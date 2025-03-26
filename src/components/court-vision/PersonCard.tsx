
import { useDrag } from "react-dnd";
import { User, UserCog, Trash2, Users, AlertCircle, Tag } from "lucide-react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PersonData, Program } from "./types";
import { PERSON_TYPES } from "./constants";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
    canDrag: person.isPresent !== false, // Can drag if not explicitly marked as absent
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
  
  // Find all assigned programs
  const assignedPrograms = person.programIds 
    ? programs.filter(p => person.programIds?.includes(p.id))
    : person.programId 
      ? [programs.find(p => p.id === person.programId)] 
      : [];
      
  // Filter out undefined programs
  const validPrograms = assignedPrograms.filter(Boolean) as Program[];

  // Determine if person has assigned programs
  const hasProgram = validPrograms.length > 0;
  
  // Determine if the coach is unavailable
  const isUnavailable = person.isPresent === false;

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
        >
          <div className="flex items-center space-x-2">
            {/* Avatar with color from primary program */}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                person.type === PERSON_TYPES.PLAYER 
                  ? hasProgram 
                    ? "bg-gradient-to-r from-ath-blue to-ath-blue-light" 
                    : "bg-ath-blue" 
                  : "bg-ath-red-clay"
              }`}
              style={validPrograms[0]?.color ? { backgroundColor: validPrograms[0]?.color } : {}}
            >
              {person.type === PERSON_TYPES.PLAYER ? (
                <User className="w-4 h-4" />
              ) : (
                <UserCog className="w-4 h-4" />
              )}
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[150px]">{person.name}</span>
              
              {/* Show email if available */}
              {person.email && (
                <span className="text-xs text-gray-500 truncate max-w-[150px]">
                  {person.email}
                </span>
              )}
              
              {/* Program badges */}
              {validPrograms.length > 0 && (
                <div className="flex flex-wrap mt-1 gap-1">
                  {validPrograms.map(program => (
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
                  ))}
                </div>
              )}
              
              {/* Absence reason */}
              {isUnavailable && (
                <div className="flex items-center mt-1 text-xs text-red-500">
                  <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate max-w-[140px]">
                    {person.absenceReason || "Non disponibile"}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex">
            {onAddToDragArea && (
              <button
                onClick={handleAddToDragArea}
                className={`text-gray-400 ${isUnavailable ? "hover:text-red-400" : "hover:text-gray-600"} transition-colors p-1`}
              >
                <Users className="w-4 h-4" />
              </button>
            )}
            
            {onRemove && (
              <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent>
        {person.type === PERSON_TYPES.COACH && onAddToDragArea && !isUnavailable && (
          <ContextMenuItem onClick={handleAddToDragArea}>
            <Users className="w-4 h-4 mr-2" />
            <span>Aggiungi all'area di trascinamento</span>
          </ContextMenuItem>
        )}
        
        {isUnavailable && (
          <ContextMenuItem className="text-red-500" disabled>
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>{person.absenceReason || "Non disponibile"}</span>
          </ContextMenuItem>
        )}
        
        {validPrograms.length > 0 && (
          <ContextMenuItem disabled>
            <Tag className="w-4 h-4 mr-2" />
            <span>Programmi: {validPrograms.map(p => p.name).join(', ')}</span>
          </ContextMenuItem>
        )}
        
        {onRemove && (
          <ContextMenuItem onClick={onRemove} className="text-red-500">
            <Trash2 className="w-4 h-4 mr-2" />
            <span>Rimuovi</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
