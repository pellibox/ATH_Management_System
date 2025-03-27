
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TimelineLabelsProps {
  timeSlots: string[];
}

export function TimelineLabels({ timeSlots }: TimelineLabelsProps) {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'w-12' : 'w-16'} flex flex-col sticky left-0 z-20 bg-white shadow-sm`}>
      {timeSlots.map((time, index) => {
        // Determine if this time slot starts a new hour
        const isHourStart = index === 0 || timeSlots[index-1].split(':')[0] !== time.split(':')[0];
        const hour = time.split(':')[0];
        const minute = time.split(':')[1];
        
        return (
          <div 
            key={`time-label-${time}`} 
            className={`${isMobile ? 'h-[90px]' : 'h-[110px]'} flex items-center ${
              isHourStart ? 'border-t-2 border-t-gray-300' : ''
            }`}
          >
            <div className={`
              ${isMobile ? 'px-1 py-0.5 text-[10px]' : 'px-1.5 py-1 text-xs'} 
              font-semibold rounded shadow-sm
              ${minute === "00" ? "bg-blue-50" : "bg-white"}
            `}>
              {time}
            </div>
          </div>
        );
      })}
    </div>
  );
}
