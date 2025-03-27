
import { useState, useEffect } from 'react';
import { CourtProps, PersonData, ActivityData } from './types';
import { Court } from './Court';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { VerticalTimeSlotSelector } from './time-slot/VerticalTimeSlotSelector';

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
  activeHour?: string | null; // The prop coming from parent
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
  onChangeCourtNumber,
  activeHour: propActiveHour // Renamed to propActiveHour to avoid conflict
}: CourtGridProps) {
  const isMobile = useIsMobile();
  const [currentActiveHour, setCurrentActiveHour] = useState<string | null>(propActiveHour || null);
  
  // Map to store active hour for each court type group
  const [activeHoursByType, setActiveHoursByType] = useState<Record<string, string | null>>({});
  
  // Initialize currentActiveHour from the first time slot on component mount or when propActiveHour changes
  useEffect(() => {
    if (propActiveHour) {
      setCurrentActiveHour(propActiveHour);
      
      // Also update all court type groups with the same hour
      const initialHoursByType: Record<string, string | null> = {};
      courts.forEach(court => {
        initialHoursByType[court.type] = propActiveHour;
      });
      setActiveHoursByType(initialHoursByType);
    } else if (timeSlots.length > 0 && !currentActiveHour) {
      const firstHour = timeSlots[0].split(':')[0];
      setCurrentActiveHour(firstHour);
    }
  }, [timeSlots, currentActiveHour, propActiveHour, courts]);
  
  // Get unique hours from time slots
  const getUniqueHours = (slots: string[]) => {
    const uniqueHours = new Set(slots.map(slot => slot.split(':')[0]));
    return Array.from(uniqueHours).sort((a, b) => parseInt(a) - parseInt(b));
  };

  // Get all hours for timeline
  const hours = getUniqueHours(timeSlots);
  
  // Handle hour change for a specific court type
  const handleHourChangeForType = (type: string, hour: string) => {
    setActiveHoursByType(prev => ({
      ...prev,
      [type]: hour
    }));
  };
  
  // Get active hour for a court type
  const getActiveHourForType = (type: string): string | null => {
    return activeHoursByType[type] || currentActiveHour;
  };
  
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
      <div className="space-y-6 md:space-y-8 pb-16 pt-4">
        {Object.entries(courtsByType).map(([type, typeCourts]) => {
          // Get active hour for this court type
          const typeActiveHour = getActiveHourForType(type);
          
          // Organize courts in pairs (or single if odd number)
          const courtPairs: CourtProps[][] = [];
          for (let i = 0; i < typeCourts.length; i += 2) {
            if (i + 1 < typeCourts.length) {
              courtPairs.push([typeCourts[i], typeCourts[i+1]]);
            } else {
              courtPairs.push([typeCourts[i]]);
            }
          }
          
          return (
            <div key={type} className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-semibold px-4">{type}</h3>
              
              {courtPairs.map((pair, pairIndex) => (
                <div key={`pair-${type}-${pairIndex}`} className="flex gap-4 md:gap-6 px-4">
                  {/* Vertical time slot selector for this pair */}
                  <div className="w-16 md:w-20">
                    <VerticalTimeSlotSelector
                      timeSlots={timeSlots}
                      activeHour={typeActiveHour}
                      onHourChange={(hour) => handleHourChangeForType(type, hour)}
                    />
                  </div>
                  
                  {/* Courts in this pair */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {pair.map((court) => (
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
                        activeHour={typeActiveHour}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        
        {Object.keys(courtsByType).length === 0 && (
          <div className="text-center py-6 md:py-12 bg-gray-50 rounded-lg mx-4">
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
