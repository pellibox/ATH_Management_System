
import React, { useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { PersonData, ActivityData } from "../types";
import { TimeSlotHeader } from "./TimeSlotHeader";
import { TimeSlotOccupants } from "./TimeSlotOccupants";
import { TimeSlotActivities } from "./TimeSlotActivities";
import { TimeSlotDropArea } from "./TimeSlotDropArea";

interface TimeSlotProps {
  courtId: string;
  time: string;
  occupants: PersonData[];
  activities: ActivityData[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, time?: string) => void;
  onRemoveActivity: (activityId: string, time?: string) => void;
}

export function TimeSlot({ 
  courtId, 
  time, 
  occupants, 
  activities, 
  onDrop, 
  onActivityDrop, 
  onRemovePerson, 
  onRemoveActivity 
}: TimeSlotProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: -100, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: 100, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex border-b border-gray-200">
      <div className="flex-1 p-2 relative">
        <TimeSlotHeader time={time} />
        
        <div className="relative">
          <div 
            ref={scrollContainerRef} 
            className="max-h-[200px] overflow-auto pr-8 relative"
          >
            <TimeSlotOccupants 
              occupants={occupants} 
              onRemovePerson={onRemovePerson}
              time={time}
            />
            <TimeSlotActivities 
              activities={activities} 
              onRemoveActivity={onRemoveActivity}
              time={time}
            />
          </div>
          
          {/* Always show Vertical Scroll Control */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center items-center w-6 bg-gray-50/80 border-l border-gray-100">
            <button 
              onClick={scrollUp} 
              className="hover:bg-gray-200 rounded-full p-1 mb-1"
              aria-label="Scroll up"
            >
              <ChevronUp className="h-4 w-4 text-gray-500" />
            </button>
            <button 
              onClick={scrollDown} 
              className="hover:bg-gray-200 rounded-full p-1"
              aria-label="Scroll down"
            >
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        <TimeSlotDropArea 
          courtId={courtId}
          time={time}
          onDrop={onDrop}
          onActivityDrop={onActivityDrop}
        />
      </div>
    </div>
  );
}
