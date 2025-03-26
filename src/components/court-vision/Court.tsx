import { useState } from "react";
import { useDrop } from "react-dnd";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES } from "./constants";
import { CourtProps, PersonData, ActivityData } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Trash2, Edit, Clock } from "lucide-react";
import { TimeSlot } from "./TimeSlot";
import { Input } from "@/components/ui/input";
import { CourtPerson } from "./CourtPerson";
import { CourtActivity } from "./CourtActivity";
import { CourtLayout } from "./CourtLayout";
import { CourtSettings } from "./CourtSettings";
import { CourtHeader } from "./CourtHeader";
import { CourtControls } from "./CourtControls";

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
  const [viewMode, setViewMode] = useState<"layout" | "schedule">("layout");
  const [isEditing, setIsEditing] = useState(false);
  const [courtName, setCourtName] = useState(court.name);
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [courtNumber, setCourtNumber] = useState(court.number);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity"],
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const initialOffset = monitor.getInitialClientOffset();
      const containerRect = document.getElementById(`court-${court.id}`)?.getBoundingClientRect();
      
      if (clientOffset && containerRect && initialOffset) {
        const position = {
          x: (clientOffset.x - containerRect.left) / containerRect.width,
          y: (clientOffset.y - containerRect.top) / containerRect.height
        };
        
        if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) {
          if (viewMode === "layout") {
            onDrop(court.id, item as PersonData, position);
          } else {
            console.log("Court component: schedule view drop - no direct action needed");
          }
        } else if (item.type === "activity") {
          if (viewMode === "layout") {
            onActivityDrop(court.id, item as ActivityData);
          } else {
            console.log("Court component: schedule view activity drop - no direct action needed");
          }
        }
      } else {
        if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) {
          if (viewMode === "layout") {
            onDrop(court.id, item as PersonData);
          } else {
            console.log("Court component: schedule view drop without position - no direct action needed");
          }
        } else if (item.type === "activity") {
          if (viewMode === "layout") {
            onActivityDrop(court.id, item as ActivityData);
          } else {
            console.log("Court component: schedule view activity drop without position - no direct action needed");
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [court.id, onDrop, onActivityDrop, viewMode]);

  const getCourtStyles = () => {
    switch (court.type) {
      case COURT_TYPES.TENNIS_CLAY:
        return "bg-ath-clay/10 border-ath-clay";
      case COURT_TYPES.TENNIS_HARD:
        return "bg-ath-hard/20 border-ath-hard";
      case COURT_TYPES.PADEL:
        return "bg-ath-grass/20 border-ath-grass";
      case COURT_TYPES.PICKLEBALL:
        return "bg-yellow-100 border-yellow-400";
      case COURT_TYPES.TOUCH_TENNIS:
        return "bg-purple-100 border-purple-400";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getCourtLabel = () => {
    const type = court.type.split("-");
    const surface = type.length > 1 ? ` (${type[1]})` : "";
    return `${type[0].charAt(0).toUpperCase() + type[0].slice(1)}${surface}`;
  };

  const isTimeSlotOccupied = (object: PersonData | ActivityData, timeSlot: string): boolean => {
    const isPerson = 'type' in object && (object.type === PERSON_TYPES.PLAYER || object.type === PERSON_TYPES.COACH);
    const isActivity = 'type' in object && object.type.startsWith('activity');
    
    let startSlot: string | undefined;
    
    if (isPerson && 'timeSlot' in object) {
      startSlot = object.timeSlot;
    } else if (isActivity && 'startTime' in object) {
      startSlot = object.startTime;
    } else {
      return false;
    }
    
    if (!startSlot) return false;
    
    const startIndex = timeSlots.indexOf(startSlot);
    const currentIndex = timeSlots.indexOf(timeSlot);
    
    if (startIndex === -1 || currentIndex === -1) return false;
    
    const duration = object.durationHours || 1;
    const slotsNeeded = Math.ceil(duration * 2);
    const endIndex = startIndex + slotsNeeded - 1;
    
    return currentIndex >= startIndex && currentIndex <= endIndex;
  };

  const getOccupantsForTimeSlot = (time: string) => {
    return court.occupants.filter(person => 
      isTimeSlotOccupied(person, time) || 
      (person.timeSlot === time) || 
      (!person.timeSlot && time === timeSlots[0])
    );
  };

  const getActivitiesForTimeSlot = (time: string) => {
    return court.activities.filter(activity => 
      isTimeSlotOccupied(activity, time) ||
      (activity.startTime === time) || 
      (!activity.startTime && time === timeSlots[0])
    );
  };

  const handleSaveCourtName = () => {
    if (courtName.trim() && onRename) {
      onRename(court.id, courtName);
    }
    setIsEditing(false);
  };

  const handleSaveCourtNumber = () => {
    if (onChangeNumber && !isNaN(courtNumber)) {
      onChangeNumber(court.id, courtNumber);
    }
    setIsEditingNumber(false);
  };

  const visibleOccupants = viewMode === "layout" 
    ? court.occupants.filter(person => !person.timeSlot).slice(0, 12)
    : [];
  const hasMoreOccupants = visibleOccupants.length > 12;

  const handleChangePersonTimeSlot = (personId: string, timeSlot: string) => {
    const person = court.occupants.find(p => p.id === personId);
    if (person && onRemovePerson && onDrop) {
      onRemovePerson(personId, person.timeSlot);
      onDrop(court.id, {...person, timeSlot}, person.position, timeSlot);
    }
  };

  const courtHeight = isSidebarCollapsed ? "h-[675px]" : "h-96 sm:h-[600px]";
  const courtWidth = isSidebarCollapsed ? "w-[600px]" : "w-full";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          id={`court-${court.id}`}
          ref={drop}
          className={`relative rounded-lg border-2 ${getCourtStyles()} ${
            isOver ? "ring-2 ring-ath-red-clay" : ""
          } transition-all ${courtHeight} ${courtWidth} flex flex-col cursor-pointer animate-fade-in mx-auto`}
        >
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
            <span className="text-xs font-medium bg-ath-black/70 text-white px-2 py-1 rounded">
              {court.name} 
              <span className="ml-1 cursor-pointer" onClick={(e) => {
                e.stopPropagation();
                setIsEditingNumber(true);
              }}>
                #{court.number}
              </span>
              {isEditingNumber && (
                <div onClick={(e) => e.stopPropagation()} className="absolute z-50 mt-1 bg-white rounded shadow-md p-2">
                  <Input
                    type="number"
                    value={courtNumber}
                    onChange={(e) => setCourtNumber(parseInt(e.target.value) || 1)}
                    className="w-16 h-8 text-xs text-black"
                    min={1}
                    autoFocus
                    onBlur={handleSaveCourtNumber}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveCourtNumber();
                      } else if (e.key === 'Escape') {
                        setIsEditingNumber(false);
                        setCourtNumber(court.number);
                      }
                    }}
                  />
                </div>
              )}
            </span>
            <span className="text-xs bg-ath-black/70 text-white px-2 py-1 rounded">{getCourtLabel()}</span>
          </div>

          <CourtControls viewMode={viewMode} setViewMode={setViewMode} />

          {viewMode === "layout" && (
            <>
              <CourtLayout type={court.type} />
              
              {visibleOccupants.map((person, index) => (
                <CourtPerson
                  key={person.id}
                  person={person}
                  index={index}
                  total={visibleOccupants.length}
                  position={person.position}
                  onRemove={() => onRemovePerson && onRemovePerson(person.id)}
                />
              ))}

              {hasMoreOccupants && (
                <div className="absolute right-3 bottom-3 z-10 bg-ath-black text-white text-xs px-2 py-1 rounded-full">
                  +{court.occupants.length - 12}
                </div>
              )}

              {court.activities.filter(activity => !activity.startTime).length > 0 && (
                <div className="absolute top-10 left-2 right-2 bg-ath-black/30 p-1 rounded">
                  <div className="flex flex-wrap gap-1">
                    {court.activities.filter(activity => !activity.startTime).map((activity) => (
                      <CourtActivity
                        key={activity.id}
                        activity={activity}
                        onRemove={() => onRemoveActivity && onRemoveActivity(activity.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {viewMode === "schedule" && (
            <div className="flex-1 flex flex-col mt-12 mb-1">
              <div className="sticky top-0 z-10 bg-white shadow-sm">
                <div className="h-8 border-b border-gray-200 flex items-center px-2">
                  <span className="text-xs font-medium">Orari - {court.name} #{court.number}</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {timeSlots.map((time) => (
                  <TimeSlot
                    key={`${court.id}-${time}`}
                    courtId={court.id}
                    time={time}
                    occupants={getOccupantsForTimeSlot(time)}
                    activities={getActivitiesForTimeSlot(time)}
                    onDrop={(courtId, person, position, timeSlot) => {
                      console.log("Dropping at time:", timeSlot, person);
                      onDrop(courtId, person, position, timeSlot);
                    }}
                    onActivityDrop={(courtId, activity, timeSlot) => {
                      console.log("Dropping activity at time:", timeSlot, activity);
                      onActivityDrop(courtId, activity, timeSlot);
                    }}
                    onRemovePerson={(personId, time) => onRemovePerson && onRemovePerson(personId, time)}
                    onRemoveActivity={(activityId, time) => onRemoveActivity && onRemoveActivity(activityId, time)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-2 bg-ath-black/10 max-h-20 overflow-y-auto">
            {court.occupants.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                <div className="text-xs text-gray-800 font-medium">
                  {court.occupants.length} {court.occupants.length === 1 ? 'persona' : 'persone'}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">Campo vuoto</div>
            )}
          </div>
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 bg-white shadow-lg rounded-lg border border-gray-200" sideOffset={5}>
        <CourtHeader 
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
