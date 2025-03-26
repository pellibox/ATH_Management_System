
import { CourtProps, PersonData, ActivityData } from './types';
import { Court } from './Court';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Group courts by type for display
  const courtsByType: Record<string, CourtProps[]> = {};
  
  courts.forEach(court => {
    if (!courtsByType[court.type]) {
      courtsByType[court.type] = [];
    }
    courtsByType[court.type].push(court);
  });
  
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 md:space-y-8 pb-16">
        {Object.entries(courtsByType).map(([type, typeCourts]) => (
          <div key={type} className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold">{type}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {typeCourts.map((court) => (
                <Court
                  key={court.id}
                  court={court}
                  timeSlots={timeSlots}
                  onDrop={onDrop}
                  onActivityDrop={onActivityDrop}
                  onRemovePerson={onRemovePerson}
                  onRemoveActivity={onRemoveActivity}
                  onRename={onRenameCourt}
                  onChangeType={onChangeCourtType}
                  onChangeNumber={onChangeCourtNumber}
                  isSidebarCollapsed={isMobile}
                />
              ))}
            </div>
          </div>
        ))}
        
        {Object.keys(courtsByType).length === 0 && (
          <div className="text-center py-6 md:py-12 bg-gray-50 rounded-lg">
            <p className="text-base md:text-lg text-gray-500">Non ci sono campi configurati per questo tipo</p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Puoi aggiungere campi dalle Impostazioni → Campi
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
