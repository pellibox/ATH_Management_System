import { useState, useCallback, memo } from "react";
import { useDrop, useDrag } from "react-dnd";
import { PERSON_TYPES, ACTIVITY_TYPES } from "./constants";
import { PersonData, ActivityData } from "./types";
import { Clock, Users, Move, AlertCircle } from "lucide-react";
import { DEFAULT_TIME_SLOTS } from "./context/CourtVisionDefaults";
import { useToast } from "@/hooks/use-toast";

interface TimeSlotProps {
  courtId: string;
  time: string;
  occupants: PersonData[];
  activities: ActivityData[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
}

const MAX_OCCUPANTS_PER_SLOT = 4;

function DraggablePerson({ person, time, onRemove }: { person: PersonData, time: string, onRemove: () => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: { 
      ...person, 
      sourceTimeSlot: time, 
      courtId: person.courtId,
      timeSlot: time
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getBgColor = () => {
    if (person.programColor) {
      return person.programColor;
    }
    return person.type === PERSON_TYPES.PLAYER ? "#8B5CF6" : "#1A1F2C";
  };

  return (
    <div 
      ref={drag}
      className={`text-xs px-2 py-0.5 rounded-sm flex items-center ${isDragging ? "opacity-50" : ""} cursor-grab relative`}
      style={{
        backgroundColor: getBgColor(),
        color: "white"
      }}
    >
      <Move className="h-3 w-3 mr-1 absolute right-1 opacity-50" />
      {person.name.substring(0, 10)}
      <button
        onClick={onRemove}
        className="ml-1 text-gray-300 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}

function DraggableActivity({ activity, time, onRemove }: { activity: ActivityData, time: string, onRemove: () => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "activity",
    item: { 
      ...activity, 
      sourceTimeSlot: time,
      startTime: time 
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      className={`text-xs px-2 py-0.5 rounded-sm flex items-center ${
        activity.type === ACTIVITY_TYPES.MATCH 
          ? "bg-ath-black-light text-white" 
          : activity.type === ACTIVITY_TYPES.TRAINING
          ? "bg-ath-red-clay-dark text-white"
          : activity.type === ACTIVITY_TYPES.BASKET_DRILL
          ? "bg-ath-red-clay-dark text-white"
          : activity.type === ACTIVITY_TYPES.GAME
          ? "bg-ath-black text-white"
          : "bg-ath-gray-medium text-white"
      } ${isDragging ? "opacity-50" : ""} cursor-grab relative`}
    >
      <Move className="h-3 w-3 mr-1 absolute right-1 opacity-50" />
      {activity.name}
      <button
        onClick={onRemove}
        className="ml-1 text-gray-300 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}

export const TimeSlot = memo(function TimeSlot({ 
  courtId, 
  time, 
  occupants, 
  activities, 
  onDrop, 
  onActivityDrop, 
  onRemovePerson, 
  onRemoveActivity 
}: TimeSlotProps) {
  const localTimeSlots = DEFAULT_TIME_SLOTS;
  const { toast } = useToast();
  
  const handleRemovePerson = useCallback((personId: string) => {
    onRemovePerson(personId, time);
  }, [onRemovePerson, time]);

  const handleRemoveActivity = useCallback((activityId: string) => {
    onRemoveActivity(activityId, time);
  }, [onRemoveActivity, time]);

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
    
    const startIndex = localTimeSlots.indexOf(startSlot);
    const currentIndex = localTimeSlots.indexOf(timeSlot);
    
    if (startIndex === -1 || currentIndex === -1) return false;
    
    const duration = object.durationHours || 1;
    const slotsNeeded = Math.ceil(duration * 2);
    const endIndex = startIndex + slotsNeeded - 1;
    
    return currentIndex >= startIndex && currentIndex <= endIndex;
  };

  const countExactTimeSlotOccupants = () => {
    return occupants.filter(person => person.timeSlot === time).length;
  };

  const isPlayerAssignedElsewhere = (playerId: string): boolean => {
    return false;
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity"],
    drop: (item: any) => {
      console.log("Drop in time slot:", time, "Item:", item);
      
      if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) {
        const personItem = item as PersonData;
        
        if (item.type === PERSON_TYPES.COACH && personItem.isPresent === false) {
          toast({
            title: "Coach Non Disponibile",
            description: personItem.absenceReason || "Questo coach non è disponibile",
            variant: "destructive"
          });
          return;
        }
        
        if (item.type === PERSON_TYPES.PLAYER && isPlayerAssignedElsewhere(personItem.id)) {
          toast({
            title: "Giocatore già assegnato",
            description: "Questo giocatore è già assegnato ad un altro campo in questo orario.",
            variant: "destructive"
          });
          return;
        }
        
        if (countExactTimeSlotOccupants() >= MAX_OCCUPANTS_PER_SLOT) {
          toast({
            title: "Limite Raggiunto",
            description: `Non puoi assegnare più di ${MAX_OCCUPANTS_PER_SLOT} persone allo stesso orario.`,
            variant: "destructive"
          });
          return;
        }
        
        if (personItem.sourceTimeSlot && personItem.courtId === courtId && personItem.sourceTimeSlot !== time) {
          console.log("Moving person from time slot", personItem.sourceTimeSlot, "to time slot", time);
          onRemovePerson(personItem.id, personItem.sourceTimeSlot);
        }
        
        onDrop(courtId, {...personItem, timeSlot: time}, undefined, time);
      } else if (item.type === "activity" || Object.values(ACTIVITY_TYPES).includes(item.type as any)) {
        const activityItem = item as ActivityData;
        
        if (activityItem.sourceTimeSlot && activityItem.sourceTimeSlot !== time) {
          console.log("Moving activity from time slot", activityItem.sourceTimeSlot, "to time slot", time);
          onRemoveActivity(activityItem.id, activityItem.sourceTimeSlot);
        }
        
        onActivityDrop(courtId, {...activityItem, startTime: time}, time);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [courtId, time, onDrop, onActivityDrop, onRemovePerson, onRemoveActivity, countExactTimeSlotOccupants]);

  const isAtCapacity = countExactTimeSlotOccupants() >= MAX_OCCUPANTS_PER_SLOT;

  return (
    <div 
      ref={drop}
      className={`border-t border-gray-200 p-2 min-h-[60px] relative ${
        isOver ? isAtCapacity ? "bg-red-100" : "bg-ath-red-clay-dark/40" : ""
      }`}
      data-time={time}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium">{time}</span>
        {(occupants.length > 0 || activities.length > 0) && (
          <span className="text-xs bg-ath-black text-white px-1 rounded-sm">
            {occupants.length > 0 && (
              <span className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {occupants.length}
                {isAtCapacity && <AlertCircle className="h-3 w-3 ml-1 text-red-300" />}
              </span>
            )}
          </span>
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {activities.map((activity) => (
            <DraggableActivity 
              key={activity.id}
              activity={activity}
              time={time}
              onRemove={() => handleRemoveActivity(activity.id)}
            />
          ))}
        </div>
      )}
      
      {occupants.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {occupants.map((person) => (
            <DraggablePerson
              key={person.id}
              person={person}
              time={time}
              onRemove={() => handleRemovePerson(person.id)}
            />
          ))}
        </div>
      )}
      
      {isAtCapacity && (
        <div className="absolute inset-0 bg-red-50/30 pointer-events-none flex items-center justify-center">
          {isOver && (
            <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              Limite massimo raggiunto
            </div>
          )}
        </div>
      )}
    </div>
  );
});
