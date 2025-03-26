
import { PersonData, Program } from "@/components/court-vision/types";
import { PlayerCard } from "@/components/court-vision/PlayerCard";

interface CoachesListProps {
  filteredCoaches: PersonData[];
  programs: Program[];
  handleAssignProgram: (coachId: string, programId: string) => void;
  handleSendSchedule: (coachId: string, type: "day" | "week" | "month") => void;
}

export function CoachesList({ 
  filteredCoaches, 
  programs, 
  handleAssignProgram, 
  handleSendSchedule 
}: CoachesListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredCoaches.length > 0 ? (
        filteredCoaches.map(coach => (
          <PlayerCard
            key={coach.id}
            player={coach}
            programs={programs}
            onAssignProgram={handleAssignProgram}
            onSendSchedule={handleSendSchedule}
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
