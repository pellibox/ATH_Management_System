
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

            <div className="flex-1 overflow-hidden">
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
