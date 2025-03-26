
import { AlertCircle, Tag, Trash2, Users } from "lucide-react";
import { 
  ContextMenuContent,
  ContextMenuItem
} from "@/components/ui/context-menu";
import { PersonData } from "../types";
import { Program } from "../types";
import { PERSON_TYPES } from "../constants";

interface PersonContextMenuProps {
  person: PersonData;
  validPrograms: Program[];
  onAddToDragArea?: (person: PersonData) => void;
  onRemove?: () => void;
  isUnavailable: boolean;
}

export function PersonContextMenu({ 
  person, 
  validPrograms, 
  onAddToDragArea, 
  onRemove,
  isUnavailable
}: PersonContextMenuProps) {
  return (
    <ContextMenuContent>
      {person.type === PERSON_TYPES.COACH && onAddToDragArea && !isUnavailable && (
        <ContextMenuItem onClick={() => onAddToDragArea(person)}>
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
  );
}
