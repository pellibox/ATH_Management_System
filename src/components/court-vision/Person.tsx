
import { useDrag } from "react-dnd";
import { User, UserCog, Trash2, Users } from "lucide-react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PersonData } from "./types";
import { PERSON_TYPES } from "./constants";

interface PersonProps {
  person: PersonData;
  onRemove?: () => void;
  onAddToDragArea?: (person: PersonData) => void;
}

export function Person({ person, onRemove, onAddToDragArea }: PersonProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: person,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleAddToDragArea = () => {
    if (onAddToDragArea) {
      onAddToDragArea(person);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={drag}
          className={`flex items-center justify-between p-2 my-1 bg-gray-50 rounded-md border border-gray-200 ${
            isDragging ? "opacity-50" : ""
          } hover:bg-gray-100 transition-colors cursor-move`}
        >
          <div className="flex items-center space-x-2">
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                person.type === PERSON_TYPES.PLAYER ? "bg-ath-blue" : "bg-ath-red-clay"
              }`}
            >
              {person.type === PERSON_TYPES.PLAYER ? (
                <User className="w-3 h-3" />
              ) : (
                <UserCog className="w-3 h-3" />
              )}
            </div>
            <span className="text-sm font-medium truncate max-w-[150px]">{person.name}</span>
          </div>
          
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent>
        {person.type === PERSON_TYPES.COACH && onAddToDragArea && (
          <ContextMenuItem onClick={handleAddToDragArea}>
            <Users className="w-4 h-4 mr-2" />
            <span>Aggiungi all'area di trascinamento</span>
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
