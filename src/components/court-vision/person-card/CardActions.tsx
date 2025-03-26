
import { Trash2, Users } from "lucide-react";
import { PersonData } from "../types";

interface CardActionsProps {
  onAddToDragArea?: (person: PersonData) => void;
  onRemove?: () => void;
  person: PersonData;
  isUnavailable: boolean;
}

export function CardActions({ onAddToDragArea, onRemove, person, isUnavailable }: CardActionsProps) {
  return (
    <div className="flex">
      {onAddToDragArea && (
        <button
          onClick={() => onAddToDragArea(person)}
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
  );
}
