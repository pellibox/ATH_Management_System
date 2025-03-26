
import { CourtProps, PersonData, ActivityData } from './types';
import { Court } from './Court';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CourtGridProps {
  courts: CourtProps[];
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, name: string) => void;
  onChangeCourtType: (courtId: string, type: string) => void;
  onChangeCourtNumber: (courtId: string, number: number) => void;
}

export default function CourtGrid({
  courts,
  timeSlots,
  onDrop,
  onActivityDrop,
  onRemovePerson,
  onRemoveActivity,
  onRenameCourt,
  onChangeCourtType,
  onChangeCourtNumber
}: CourtGridProps) {
  // Group courts by type for display
  const courtsByType: Record<string, CourtProps[]> = {};
  
  courts.forEach(court => {
    if (!courtsByType[court.type]) {
      courtsByType[court.type] = [];
    }
    courtsByType[court.type].push(court);
  });
  
  return (
    <div className="space-y-8">
      {Object.entries(courtsByType).map(([type, typeCourts]) => (
        <div key={type} className="space-y-4">
          <h3 className="text-lg font-semibold">{type}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {typeCourts.map((court) => (
              <Court
                key={court.id}
                court={court}
                timeSlots={timeSlots}
                onDrop={(courtId, person, position, timeSlot) => {
                  console.log("CourtGrid onDrop", { courtId, person, position, timeSlot });
                  onDrop(courtId, person, position, timeSlot);
                }}
                onActivityDrop={(courtId, activity, timeSlot) => {
                  console.log("CourtGrid onActivityDrop", { courtId, activity, timeSlot });
                  onActivityDrop(courtId, activity, timeSlot);
                }}
                onRemovePerson={onRemovePerson}
                onRemoveActivity={onRemoveActivity}
                onRename={onRenameCourt}
                onChangeType={onChangeCourtType}
                onChangeNumber={onChangeCourtNumber}
              />
            ))}
          </div>
        </div>
      ))}
      
      {Object.keys(courtsByType).length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-500">Non ci sono campi configurati per questo tipo</p>
          <p className="text-sm text-gray-400 mt-1">
            Puoi aggiungere campi dalle Impostazioni → Campi
          </p>
        </div>
      )}
    </div>
  );
}
