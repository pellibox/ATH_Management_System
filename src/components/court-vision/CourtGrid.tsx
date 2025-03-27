
import { useState, useEffect } from 'react';
import { CourtProps, PersonData, ActivityData } from './types';
import { Court } from './Court';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

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
  
  // Get unique hours from time slots
  const getUniqueHours = (slots: string[]) => {
    const uniqueHours = new Set(slots.map(slot => slot.split(':')[0]));
    return Array.from(uniqueHours).sort((a, b) => parseInt(a) - parseInt(b));
  };

  // Get all hours for timeline
  const hours = getUniqueHours(timeSlots);
  
  // Initialize currentActiveHour from the first time slot on component mount or when propActiveHour changes
  useEffect(() => {
    if (propActiveHour) {
      setCurrentActiveHour(propActiveHour);
    } else if (timeSlots.length > 0 && !currentActiveHour) {
      const firstHour = timeSlots[0].split(':')[0];
      setCurrentActiveHour(firstHour);
    }
  }, [timeSlots, currentActiveHour, propActiveHour]);
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const hourIndex = value[0];
    if (hourIndex >= 0 && hourIndex < hours.length) {
      setCurrentActiveHour(hours[hourIndex]);
    }
  };
  
  // Get current hour index for slider
  const getCurrentHourIndex = () => {
    if (!currentActiveHour) return 0;
    const index = hours.indexOf(currentActiveHour);
    return index >= 0 ? index : 0;
  };

  // Get time range labels for display
  const getTimeRangeLabels = () => {
    if (hours.length === 0) return { start: "08:00", mid: "15:00", end: "21:00" };
    
    const start = hours[0] + ":00";
    const end = hours[hours.length - 1] + ":00";
    
    // Find middle hour
    const midIndex = Math.floor(hours.length / 2);
    const mid = hours[midIndex] + ":00";
    
    return { start, mid, end };
  };
  
  const timeLabels = getTimeRangeLabels();
  
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
      {/* Time Navigation Slider - External to all courts */}
      <div className="sticky top-0 z-30 px-4 py-2 bg-white shadow-md w-full">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-medium">Navigazione Oraria</h3>
        </div>
        
        <div className="w-full flex flex-col gap-2">
          {/* Hour buttons for quick selection */}
          <div className="flex gap-1 overflow-x-auto pb-1 hide-scrollbar">
            {hours.map((hour) => {
              const isActive = currentActiveHour === hour;
              const hourInt = parseInt(hour);
              const isPM = hourInt >= 12;
              const displayHour = hourInt > 12 ? hourInt - 12 : hourInt;
              const amPm = isPM ? 'PM' : 'AM';
              
              return (
                <Button
                  key={`hour-nav-${hour}`}
                  onClick={() => setCurrentActiveHour(hour)}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`${isMobile ? 'h-8 min-w-14 text-xs px-2' : 'h-8 min-w-16 text-sm px-3'} font-medium
                    ${isActive ? 'bg-blue-600' : 'hover:bg-blue-50'}`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {displayHour}{amPm}
                </Button>
              );
            })}
          </div>
          
          {/* Slider for continuous time selection */}
          <div className="px-2">
            <Slider
              defaultValue={[getCurrentHourIndex()]}
              value={[getCurrentHourIndex()]}
              max={hours.length - 1}
              step={1}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{timeLabels.start}</span>
              <span>{timeLabels.mid}</span>
              <span>{timeLabels.end}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6 md:space-y-8 pb-16 pt-4">
        {Object.entries(courtsByType).map(([type, typeCourts]) => (
          <div key={type} className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold px-4">{type}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 px-4">
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
                  activeHour={currentActiveHour}
                />
              ))}
            </div>
          </div>
        ))}
        
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
