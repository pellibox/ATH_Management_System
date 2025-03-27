
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CourtProps, PersonData, ActivityData } from "./types";
import { CourtHeader as OriginalCourtHeader } from "./CourtHeader";
import { CourtSettings } from "./CourtSettings";
import { CourtDrop } from "./court/CourtDrop";
import { getCourtStyles } from "./court/CourtStyleUtils";
import { CourtScheduleView } from "./court/CourtScheduleView";
import { CourtFooter } from "./court/CourtFooter";
import { CourtHeader as NewCourtHeader } from "./court/CourtHeader";
import { useIsMobile } from "@/hooks/use-mobile";

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
  activeHour?: string | null;
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
  isSidebarCollapsed = false,
  activeHour
}: CourtComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [courtName, setCourtName] = useState(court.name);
  const isMobile = useIsMobile();

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

  const handleValidateCourt = () => {
    // Find any coach conflicts or overlaps
    const occupantsByTimeSlot: Record<string, PersonData[]> = {};
    
    timeSlots.forEach(slot => {
      const occupantsInSlot = court.occupants.filter(p => 
        p.timeSlot === slot || 
        (p.timeSlot && p.endTimeSlot && slot >= p.timeSlot && slot <= p.endTimeSlot)
      );
      
      if (occupantsInSlot.length > 0) {
        occupantsByTimeSlot[slot] = occupantsInSlot;
      }
    });
    
    console.log(`Validating court ${court.id}`, occupantsByTimeSlot);
  };

  // Determine appropriate court height based on device and sidebar state
  let courtHeight;
  if (isMobile) {
    courtHeight = "h-[500px]"; // Mobile height
  } else if (isSidebarCollapsed) {
    courtHeight = "h-[700px]"; // Expanded view when sidebar is collapsed
  } else {
    courtHeight = "h-[650px]"; // Desktop height with sidebar
  }

  return (
    <div className="relative">
      {/* Settings button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div 
            className="absolute top-2 right-2 z-30 bg-white rounded-full p-1 shadow-md cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-full max-w-[320px] p-0 bg-white shadow-lg rounded-lg border border-gray-200" sideOffset={5}>
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

      {/* Court container */}
      <div
        id={`court-${court.id}`}
        className={`relative rounded-lg border-2 ${getCourtStyles(court.type)} 
          transition-all ${courtHeight} w-full flex flex-col cursor-pointer animate-fade-in overflow-hidden`}
      >
        <CourtDrop
          courtId={court.id}
          viewMode="schedule"
          onDrop={onDrop}
          onActivityDrop={onActivityDrop}
        >
          {/* Court header with court info */}
          <NewCourtHeader 
            courtName={court.name} 
            courtNumber={court.number} 
            courtType={court.type}
            occupants={court.occupants}
            onValidate={handleValidateCourt}
            onChangeNumber={handleChangeNumber}
          />

          {/* Main court schedule view */}
          <div className="flex-1 overflow-hidden relative">
            <CourtScheduleView
              courtId={court.id}
              courtName={court.name}
              courtNumber={court.number}
              courtType={court.type}
              timeSlots={timeSlots}
              occupants={court.occupants}
              activities={court.activities}
              onDrop={onDrop}
              onActivityDrop={onActivityDrop}
              onRemovePerson={onRemovePerson || (() => {})}
              onRemoveActivity={onRemoveActivity || (() => {})}
              activeHour={activeHour}
            />
          </div>

          {/* Court footer with summary */}
          <CourtFooter occupants={court.occupants} />
        </CourtDrop>
      </div>
    </div>
  );
}
