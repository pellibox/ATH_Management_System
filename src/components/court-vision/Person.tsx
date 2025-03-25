
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
    item: person,  // Pass the entire person object instead of just parts
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 rounded-md mb-1 ${
        isDragging ? "opacity-40" : "opacity-100"
      } ${person.type === PERSON_TYPES.PLAYER ? "bg-ath-blue-light" : "bg-orange-100"}`}
    >
      {person.type === PERSON_TYPES.PLAYER ? (
        <User className="h-4 w-4 mr-2" />
      ) : (
        <Users className="h-4 w-4 mr-2" />
      )}
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
