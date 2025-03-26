
import React from "react";

interface TimeNavigationProps {
  timeSlots: string[];
  activeHour: string | null;
  onHourSelect: (hour: string) => void;
}

export function TimeNavigation({
  timeSlots,
  activeHour,
  onHourSelect
}: TimeNavigationProps) {
  const getUniqueHours = (slots: string[]) => {
    const uniqueHours = new Set(slots.map(slot => slot.split(':')[0]));
    return Array.from(uniqueHours);
  };

  return (
    <div className="absolute right-2 top-1/4 bottom-1/4 w-10 z-30">
      <div className="sticky top-1/2 transform -translate-y-1/2 bg-white/95 border border-gray-200 rounded-lg shadow-md flex flex-col overflow-visible">
        {getUniqueHours(timeSlots).map((hour) => (
          <button
            key={`nav-${hour}`}
            onClick={() => onHourSelect(hour)}
            className={`w-full text-xs py-1 hover:bg-gray-100 text-gray-700 font-medium 
              ${activeHour === hour ? 'bg-gray-200' : ''}`}
          >
            {hour}
          </button>
        ))}
      </div>
    </div>
  );
}
