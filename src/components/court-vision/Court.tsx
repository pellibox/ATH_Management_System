
import { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CourtProps, PersonData, ActivityData } from "./types";
import { CourtHeader as OriginalCourtHeader } from "./CourtHeader";
import { CourtSettings } from "./CourtSettings";
import { CourtDrop } from "./court/CourtDrop";
import { getCourtStyles } from "./court/CourtStyleUtils";
import { CourtScheduleView } from "./court/CourtScheduleView";
import { CourtFooter } from "./court/CourtFooter";
import { CourtHeader as NewCourtHeader } from "./court/CourtHeader";
import { TimeSlotNavigation } from "./court/TimeSlotNavigation";

interface CourtComponentProps {
  court: CourtProps;
  date?: Date;
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, time?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, time?: string) => void;
  onRemovePerson?: (personId: string, time?: string) => void;
  onRemoveActivity?: (activityId: string, time?: string) => void;
  onRename?: (courtId: string, name: string) => void; 
  onChangeType?: (courtId: string, type: string) => void;
  onChangeNumber?: (courtId: string, number: number) => void;
  onCourtRemove?: (courtId: string) => void; 
  isSidebarCollapsed?: boolean;
  onAssignPerson?: (courtId: string, person: PersonData, timeSlot?: string, durationHours?: number) => void;
  onAssignActivity?: (courtId: string, activity: ActivityData, timeSlot?: string, durationHours?: number) => void;
  people?: PersonData[];
  activities?: ActivityData[];
  programs?: any[];
}

export function Court({ 
  court, 
  date,
  timeSlots,
  onDrop, 
  onActivityDrop, 
  onRemovePerson, 
  onRemoveActivity,
  onRename,
  onChangeType,
  onChangeNumber,
  onCourtRemove,
  isSidebarCollapsed = false
}: CourtComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [courtName, setCourtName] = useState(court.name);
  const [currentTimeSlotIndex, setCurrentTimeSlotIndex] = useState(0);
  const courtRef = useRef<HTMLDivElement>(null);

  const handleChangePersonTimeSlot = (personId: string, timeSlot: string) => {
    const person = court.occupants.find(p => p.id === personId);
    if (person && onRemovePerson && onDrop) {
      onRemovePerson(personId, person.timeSlot);
      onDrop(court.id, {...person, timeSlot}, person.position, timeSlot);
    }
  };

  const handleSaveCourtName = () => {
    if (courtName.trim() && onRename) {
      onRename(court.id, courtName);
    }
    setIsEditing(false);
  };

  const handleChangeNumber = (number: number) => {
    if (onChangeNumber) {
      onChangeNumber(court.id, number);
    }
  };

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
      const scrollTop = courtElement.scrollTop;
      const scrollHeight = courtElement.scrollHeight;
      const clientHeight = courtElement.clientHeight;
      
      // Find the visible time slot elements
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

  // Adjust court height based on sidebar state
  const courtHeight = isSidebarCollapsed ? "h-[675px]" : "h-96 sm:h-[600px]";
  const courtWidth = isSidebarCollapsed ? "w-[600px]" : "w-full";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          id={`court-${court.id}`}
          className={`relative rounded-lg border-2 ${getCourtStyles(court.type)} 
            transition-all ${courtHeight} ${courtWidth} flex flex-col cursor-pointer animate-fade-in mx-auto overflow-hidden`}
        >
          <CourtDrop
            courtId={court.id}
            viewMode="schedule"
            onDrop={onDrop}
            onActivityDrop={onActivityDrop}
          >
            <NewCourtHeader 
              courtName={court.name} 
              courtNumber={court.number} 
              courtType={court.type}
              onChangeNumber={handleChangeNumber}
            />

            <div className="flex-1 overflow-hidden" ref={courtRef}>
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
            </div>

            {/* Time slot navigation */}
            <TimeSlotNavigation
              onNextSlot={handleNextTimeSlot}
              onPrevSlot={handlePrevTimeSlot}
              currentIndex={currentTimeSlotIndex}
              totalSlots={timeSlots.length}
            />

            <CourtFooter occupants={court.occupants} />
          </CourtDrop>
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 bg-white shadow-lg rounded-lg border border-gray-200" sideOffset={5}>
        <OriginalCourtHeader 
          courtName={courtName}
          courtNumber={court.number}
          type={court.type}
          setIsOpen={setIsOpen}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          handleSaveCourtName={handleSaveCourtName}
          setCourtName={setCourtName}
        />
        
        <CourtSettings
          court={court}
          timeSlots={timeSlots}
          onRename={onRename}
          onChangeType={onChangeType}
          onChangeNumber={onChangeNumber}
          onCourtRemove={onCourtRemove}
          onRemovePerson={onRemovePerson}
          onRemoveActivity={onRemoveActivity}
          onSetIsOpen={setIsOpen}
          onChangePersonTimeSlot={handleChangePersonTimeSlot}
        />
      </PopoverContent>
    </Popover>
  );
}
