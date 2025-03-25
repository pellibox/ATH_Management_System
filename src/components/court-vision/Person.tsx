
import { useDrag } from "react-dnd";
import { User, Users } from "lucide-react";
import { PERSON_TYPES } from "./constants";
import { PersonData } from "./types";

interface PersonProps {
  person: PersonData;
  onRemove: () => void;
}

export function Person({ person, onRemove }: PersonProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: { 
      ...person,
      sourceTimeSlot: person.timeSlot // Add source time slot to identify where the person came from
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Determine background color based on program or default by person type
  const bgColor = person.programColor || 
    (person.type === PERSON_TYPES.PLAYER ? "bg-ath-blue-light" : "bg-orange-100");

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 rounded-md mb-1 ${
        isDragging ? "opacity-40" : "opacity-100"
      } cursor-move`}
      style={person.programColor ? { backgroundColor: `${person.programColor}20` } : {}}
    >
      <div 
        className="h-5 w-5 rounded-full flex items-center justify-center text-xs text-white mr-2"
        style={{ backgroundColor: person.programColor || 
          (person.type === PERSON_TYPES.PLAYER ? "#8B5CF6" : "#1A1F2C") }}
      >
        {person.name.substring(0, 1)}
      </div>
      <span className="text-sm">{person.name}</span>
      <button
        onClick={onRemove}
        className="ml-auto text-gray-500 hover:text-red-500"
        aria-label="Remove person"
      >
        ×
      </button>
    </div>
  );
}
