import { useState, useCallback, memo } from "react";
import { useDrop, useDrag } from "react-dnd";
import { PERSON_TYPES, ACTIVITY_TYPES } from "./constants";
import { PersonData, ActivityData } from "./types";
import { Clock, Users, Move } from "lucide-react";
import { DEFAULT_TIME_SLOTS } from "./context/CourtVisionDefaults";

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

// Draggable person component for time slot
function DraggablePerson({ person, time, onRemove }: { person: PersonData, time: string, onRemove: () => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: { 
      ...person, 
      sourceTimeSlot: time,  // Include source time slot to track movement
      courtId: person.courtId,
      timeSlot: time
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      className={`text-xs px-2 py-0.5 rounded-sm flex items-center ${isDragging ? "opacity-50" : ""} cursor-move relative`}
      style={{
        backgroundColor: person.programColor || 
          (person.type === PERSON_TYPES.PLAYER ? "#8B5CF6" : "#1A1F2C"),
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

// Draggable activity component for time slot
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
      } ${isDragging ? "opacity-50" : ""} cursor-move relative`}
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
  // Define timeSlots array from the defaults
  const timeSlots = DEFAULT_TIME_SLOTS;
  
  // Use callbacks for better performance
  const handleRemovePerson = useCallback((personId: string) => {
    onRemovePerson(personId, time);
  }, [onRemovePerson, time]);

  const handleRemoveActivity = useCallback((activityId: string) => {
    onRemoveActivity(activityId, time);
  }, [onRemoveActivity, time]);

  // Enhanced time slot checking - support for fractional hours
  const isTimeSlotOccupied = (object: PersonData | ActivityData, timeSlot: string): boolean => {
    // Use type guards to safely check properties
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
    
    // For fractional durations like 1.5 hours, calculate actual time slots needed
    const duration = object.durationHours || 1;
    // For 30-minute slots, multiply by 2 to get number of half-hour slots
    const slotsNeeded = Math.ceil(duration * 2);
    const endIndex = startIndex + slotsNeeded - 1;
    
    return currentIndex >= startIndex && currentIndex <= endIndex;
  };

  // Enhanced drop target handling
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity"],
    drop: (item: any) => {
      console.log("Drop in time slot:", time, "Item:", item);
      
      if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) {
        // Handle person drop
        const personItem = item as PersonData;
        
        // If person is moved from another time slot on the same court, handle that case
        if (personItem.sourceTimeSlot && personItem.courtId === courtId && personItem.sourceTimeSlot !== time) {
          console.log("Moving person from time slot", personItem.sourceTimeSlot, "to time slot", time);
          onRemovePerson(personItem.id, personItem.sourceTimeSlot);
        }
        
        // Update with the new time slot - the key fix for our issue
        onDrop(courtId, {...personItem, timeSlot: time}, undefined, time);
      } else if (item.type === "activity" || Object.values(ACTIVITY_TYPES).includes(item.type as any)) {
        // Handle activity drop
        const activityItem = item as ActivityData;
        
        // If activity is moved from another time slot, handle that case
        if (activityItem.sourceTimeSlot && activityItem.sourceTimeSlot !== time) {
          console.log("Moving activity from time slot", activityItem.sourceTimeSlot, "to time slot", time);
          onRemoveActivity(activityItem.id, activityItem.sourceTimeSlot);
        }
        
        // Update with the new time slot
        onActivityDrop(courtId, {...activityItem, startTime: time}, time);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [courtId, time, onDrop, onActivityDrop, onRemovePerson, onRemoveActivity]);

  return (
    <div 
      ref={drop}
      className={`border-t border-gray-200 p-2 min-h-[60px] relative ${
        isOver ? "bg-ath-red-clay-dark/40" : ""
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
    </div>
  );
});
