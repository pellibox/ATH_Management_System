
import { PersonData, Program } from "@/components/court-vision/types";
import { PlayerCard } from "@/components/court-vision/PlayerCard";
import { EXCLUDED_PROGRAMS } from "@/contexts/programs/useProgramsState";

interface CoachesListProps {
  filteredCoaches: PersonData[];
  programs: Program[];
  handleAssignProgram: (coachId: string, programId: string) => void;
  handleSendSchedule: (coachId: string, type: "day" | "week" | "month") => void;
  onSelectCoach?: (coach: PersonData) => void;
}

export function CoachesList({ 
  filteredCoaches, 
  programs, 
  handleAssignProgram, 
  handleSendSchedule,
  onSelectCoach
}: CoachesListProps) {
  // Filtriamo i programmi per rimuovere quelli esclusi
  const filteredPrograms = programs.filter(program => 
    !EXCLUDED_PROGRAMS.includes(program.id)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredCoaches.length > 0 ? (
        filteredCoaches.map(coach => (
          <PlayerCard
            key={coach.id}
            player={coach}
            programs={filteredPrograms}
            onAssignProgram={handleAssignProgram}
            onSendSchedule={handleSendSchedule}
            onViewCalendar={onSelectCoach ? () => onSelectCoach(coach) : undefined}
            multiplePrograms={true} // Enable multiple program selection
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12 text-gray-500">
          Nessun allenatore trovato con i criteri di ricerca specificati
        </div>
      )}
    </div>
  );
}
