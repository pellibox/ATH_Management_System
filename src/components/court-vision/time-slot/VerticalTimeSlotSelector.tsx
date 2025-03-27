
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface VerticalTimeSlotSelectorProps {
  timeSlots: string[];
  activeHour: string | null;
  onHourChange: (hour: string) => void;
}

export function VerticalTimeSlotSelector({ 
  timeSlots, 
  activeHour, 
  onHourChange 
}: VerticalTimeSlotSelectorProps) {
  const isMobile = useIsMobile();
  
  // Get unique hours from time slots
  const getUniqueHours = (slots: string[]) => {
    const uniqueHours = new Set(slots.map(slot => slot.split(':')[0]));
    return Array.from(uniqueHours).sort((a, b) => parseInt(a) - parseInt(b));
  };

  // Get all hours for timeline
  const hours = getUniqueHours(timeSlots);
  
  // Get current hour index for slider
  const getCurrentHourIndex = () => {
    if (!activeHour) return 0;
    const index = hours.indexOf(activeHour);
    return index >= 0 ? index : 0;
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const hourIndex = value[0];
    if (hourIndex >= 0 && hourIndex < hours.length) {
      onHourChange(hours[hourIndex]);
    }
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
  
  return (
    <div className="h-full flex flex-col justify-start py-4 px-2 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-1 mb-2">
        <Clock className="h-4 w-4 text-blue-600" />
        <h3 className="text-xs font-medium">Orario</h3>
      </div>
      
      {/* Vertical slider for time selection */}
      <div className="flex-1 flex flex-col h-full">
        <div className="h-full flex items-center">
          <Slider
            defaultValue={[getCurrentHourIndex()]}
            value={[getCurrentHourIndex()]}
            max={hours.length - 1}
            step={1}
            onValueChange={handleSliderChange}
            orientation="vertical"
            className="h-full mx-auto"
          />
        </div>
        
        {/* Vertical time labels */}
        <div className="flex flex-col items-center text-xs text-gray-500 mt-2 space-y-2">
          <span>{timeLabels.end}</span>
          <span>{timeLabels.mid}</span>
          <span>{timeLabels.start}</span>
        </div>
      </div>
    </div>
  );
}
