
import { PersonData } from "./types";
import { PersonCard } from "./PersonCard";
import { getProgramColor } from "@/components/players/utils/programUtils";

interface PersonProps {
  person: PersonData;
  onRemove?: () => void;
  onAddToDragArea?: (person: PersonData) => void;
  programs?: any[];
}

export function Person({ person, onRemove, onAddToDragArea, programs = [] }: PersonProps) {
  // Get program color using the same utility as in PlayerRow
  const programColor = person.program ? getProgramColor(person.program) : 
                     (person.programId && programs.find(p => p.id === person.programId)?.color) || "#e0e0e0";

  // Simple wrapper component that passes props to PersonCard
  return (
    <PersonCard
      person={person}
      programs={programs}
      onRemove={onRemove}
      onAddToDragArea={onAddToDragArea}
    />
  );
}
