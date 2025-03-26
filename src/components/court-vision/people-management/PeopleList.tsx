
import { useMemo } from "react";
import { PersonData, Program } from "../types";
import { PersonCard } from "../PersonCard";
import { CoachAvailabilityActions } from "../CoachAvailabilityActions";
import { useToast } from "@/hooks/use-toast";

interface PeopleListProps {
  people: PersonData[];
  programs: Program[];
  searchQuery: string;
  programFilter: string;
  availabilityFilter?: string;
  onAddToDragArea: (person: PersonData) => void;
  isCoachesList?: boolean;
}

export function PeopleList({ 
  people, 
  programs, 
  searchQuery, 
  programFilter, 
  availabilityFilter = "all",
  onAddToDragArea,
  isCoachesList = false
}: PeopleListProps) {
  const { toast } = useToast();

  // Apply filters
  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      // Search filter
      const matchesSearch = !searchQuery || 
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (person.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        
      // Program filter
      const matchesProgram = programFilter === "all" 
        ? true 
        : programFilter === "none" 
          ? !person.programId && (!person.programIds || person.programIds.length === 0)
          : person.programId === programFilter || (person.programIds && person.programIds.includes(programFilter));
          
      // Availability filter (only for coaches)
      const matchesAvailability = !isCoachesList || availabilityFilter === "all" 
        ? true 
        : availabilityFilter === "available" 
          ? person.isPresent !== false
          : person.isPresent === false;
      
      return matchesSearch && matchesProgram && matchesAvailability;
    });
  }, [people, searchQuery, programFilter, availabilityFilter, isCoachesList]);

  // Only allow adding people to drag area if they're available
  const handleAddPersonToDragArea = (person: PersonData) => {
    if (person.isPresent === false) {
      toast({
        title: "Coach Non Disponibile",
        description: person.absenceReason || "Questo coach non è disponibile",
        variant: "destructive"
      });
      return;
    }
    
    onAddToDragArea(person);
  };

  if (filteredPeople.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-4 text-center bg-gray-50 rounded-md">
        {searchQuery 
          ? "Nessun risultato trovato" 
          : programFilter !== "all" 
            ? `Nessun ${isCoachesList ? 'allenatore' : 'giocatore'} con questo programma` 
            : isCoachesList && availabilityFilter !== "all"
              ? availabilityFilter === "available" 
                ? "Nessun allenatore disponibile" 
                : "Nessun allenatore indisponibile"
              : `Non ci sono ${isCoachesList ? 'allenatori' : 'giocatori'} nel database`}
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto mt-0">
      {filteredPeople.map((person) => (
        <div key={person.id} className="mb-2">
          <PersonCard
            person={person}
            programs={programs}
            onAddToDragArea={handleAddPersonToDragArea}
          />
          {isCoachesList && (
            <div className="mt-1 ml-10">
              <CoachAvailabilityActions coach={person} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
