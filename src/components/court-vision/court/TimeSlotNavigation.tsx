
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TimeSlotNavigationProps { 
  onNextSlot: () => void;
  onPrevSlot: () => void;
  currentIndex: number;
  totalSlots: number;
}

export function TimeSlotNavigation({ 
  onNextSlot, 
  onPrevSlot, 
  currentIndex, 
  totalSlots 
}: TimeSlotNavigationProps) {
  // Calculate the percentage of progress through the time slots
  const progressPercentage = totalSlots > 1 
    ? Math.round((currentIndex / (totalSlots - 1)) * 100) 
    : 0;

  return (
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center bg-white/90 rounded-full shadow-md border border-gray-200 z-20">
      <button
        className="p-1 hover:bg-gray-100 rounded-t-full disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={onPrevSlot}
        disabled={currentIndex === 0}
        aria-label="Previous time slot"
      >
        <ChevronUp className="h-5 w-5 text-ath-red-clay" />
      </button>
      
      {/* Progress indicator */}
      <div className="h-16 w-1 mx-auto relative bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute bottom-0 w-full bg-ath-red-clay rounded-full transition-all duration-300"
          style={{ height: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <button
        className="p-1 hover:bg-gray-100 rounded-b-full disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={onNextSlot}
        disabled={currentIndex === totalSlots - 1}
        aria-label="Next time slot"
      >
        <ChevronDown className="h-5 w-5 text-ath-red-clay" />
      </button>
    </div>
  );
}
