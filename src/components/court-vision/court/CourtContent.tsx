
import { useState, useRef, useEffect } from "react";
import { CourtProps, PersonData, ActivityData } from "../types";
import { CourtScheduleView } from "./CourtScheduleView";
import { TimeSlotNavigation } from "./TimeSlotNavigation";

interface CourtContentProps {
  court: CourtProps;
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, time?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, time?: string) => void;
  onRemovePerson?: (personId: string, time?: string) => void;
  onRemoveActivity?: (activityId: string, time?: string) => void;
}

export function CourtContent({
  court,
  timeSlots,
  onDrop,
  onActivityDrop,
  onRemovePerson,
  onRemoveActivity
}: CourtContentProps) {
  const [currentTimeSlotIndex, setCurrentTimeSlotIndex] = useState(0);
  const courtRef = useRef<HTMLDivElement>(null);

  const handleNextTimeSlot = () => {
    if (currentTimeSlotIndex < timeSlots.length - 1) {
      setCurrentTimeSlotIndex(currentTimeSlotIndex + 1);
      scrollToTimeSlot(timeSlots[currentTimeSlotIndex + 1]);
    }
  };

  const handlePrevTimeSlot = () => {
    if (currentTimeSlotIndex > 0) {
      setCurrentTimeSlotIndex(currentTimeSlotIndex - 1);
      scrollToTimeSlot(timeSlots[currentTimeSlotIndex - 1]);
    }
  };

  const scrollToTimeSlot = (timeSlot: string) => {
    if (courtRef.current) {
      const timeSlotElement = courtRef.current.querySelector(`[data-time-slot="${timeSlot}"]`);
      if (timeSlotElement) {
        timeSlotElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Track visible time slot based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!courtRef.current) return;
      
      const courtElement = courtRef.current;
      const timeSlotElements = courtElement.querySelectorAll('[data-time-slot]');
      
      // Find which time slot is most visible
      let mostVisibleIndex = 0;
      let maxVisibility = 0;
      
      timeSlotElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const courtRect = courtElement.getBoundingClientRect();
        
        // Calculate how much of the element is visible in the viewport
        const visibleTop = Math.max(rect.top, courtRect.top);
        const visibleBottom = Math.min(rect.bottom, courtRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleHeight > maxVisibility) {
          maxVisibility = visibleHeight;
          mostVisibleIndex = index;
        }
      });
      
      if (mostVisibleIndex !== currentTimeSlotIndex) {
        setCurrentTimeSlotIndex(mostVisibleIndex);
      }
    };
    
    const courtElement = courtRef.current;
    if (courtElement) {
      courtElement.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (courtElement) {
        courtElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentTimeSlotIndex, timeSlots]);

  return (
    <div className="flex-1 overflow-auto relative" ref={courtRef}>
      <CourtScheduleView
        courtId={court.id}
        courtName={court.name}
        courtNumber={court.number}
        timeSlots={timeSlots}
        occupants={court.occupants}
        activities={court.activities}
        onDrop={onDrop}
        onActivityDrop={onActivityDrop}
        onRemovePerson={onRemovePerson || (() => {})}
        onRemoveActivity={onRemoveActivity || (() => {})}
      />
      
      <TimeSlotNavigation
        onNextSlot={handleNextTimeSlot}
        onPrevSlot={handlePrevTimeSlot}
        currentIndex={currentTimeSlotIndex}
        totalSlots={timeSlots.length}
      />
    </div>
  );
}
