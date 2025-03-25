
import { useState, useCallback, memo } from "react";
import { useDrop, useDrag } from "react-dnd";
import { PERSON_TYPES, ACTIVITY_TYPES } from "./constants";
import { PersonData, ActivityData } from "./types";
import { Clock, Users } from "lucide-react";

interface TimeSlotProps {
  courtId: string;
  time: string;
  occupants: PersonData[];
  activities: ActivityData[];
  onDrop: (courtId: string, time: string, person: PersonData) => void;
  onActivityDrop: (courtId: string, time: string, activity: ActivityData) => void;
  onRemovePerson: (personId: string, time: string) => void;
  onRemoveActivity: (activityId: string, time: string) => void;
}

// Crea un componente persona trascinabile per la fascia oraria
function DraggablePerson({ person, time, onRemove }: { person: PersonData, time: string, onRemove: () => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: person.type,
    item: { 
      ...person, 
      sourceTimeSlot: time,  // Includi la fascia oraria di origine per tracciare il movimento
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
      className={`text-xs px-2 py-0.5 rounded-sm flex items-center ${isDragging ? "opacity-50" : ""} cursor-move`}
      style={{
        backgroundColor: person.programColor || 
          (person.type === PERSON_TYPES.PLAYER ? "#8B5CF6" : "#1A1F2C"),
        color: "white"
      }}
    >
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

// Crea un componente attività trascinabile per la fascia oraria
function DraggableActivity({ activity, time, onRemove }: { activity: ActivityData, time: string, onRemove: () => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: activity.type,
    item: { 
      ...activity, 
      sourceTimeSlot: time,  // Includi la fascia oraria di origine per tracciare il movimento
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
      } ${isDragging ? "opacity-50" : ""} cursor-move`}
    >
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
  // Usa callback memorizzati per prestazioni migliori
  const handleRemovePerson = useCallback((personId: string) => {
    onRemovePerson(personId, time);
  }, [onRemovePerson, time]);

  const handleRemoveActivity = useCallback((activityId: string) => {
    onRemoveActivity(activityId, time);
  }, [onRemoveActivity, time]);

  // Ottimizza la logica di drag & drop
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, ACTIVITY_TYPES.MATCH, ACTIVITY_TYPES.TRAINING, ACTIVITY_TYPES.BASKET_DRILL, ACTIVITY_TYPES.GAME, "activity"],
    drop: (item: any) => {
      console.log("Trascinamento nella fascia oraria:", time, "Elemento:", item);
      
      if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) {
        // Gestisci il trascinamento della persona
        const personItem = item as PersonData;
        
        // Rimuovi il riferimento alla fascia oraria originale se necessario
        if (personItem.sourceTimeSlot && personItem.sourceTimeSlot !== time && personItem.courtId === courtId) {
          console.log("Spostamento persona dalla fascia oraria", personItem.sourceTimeSlot, "a", time);
          onRemovePerson(personItem.id, personItem.sourceTimeSlot);
        }
        
        // Aggiorna con la nuova fascia oraria
        onDrop(courtId, time, personItem);
      } else if (item.type && (
        item.type === "activity" || 
        item.type === ACTIVITY_TYPES.MATCH || 
        item.type === ACTIVITY_TYPES.TRAINING || 
        item.type === ACTIVITY_TYPES.BASKET_DRILL || 
        item.type === ACTIVITY_TYPES.GAME || 
        item.type.toString().startsWith("activity")
      )) {
        // Gestisci il trascinamento dell'attività
        const activityItem = item as ActivityData;
        
        // Rimuovi il riferimento alla fascia oraria originale se necessario
        if (activityItem.sourceTimeSlot && activityItem.sourceTimeSlot !== time && activityItem.courtId === courtId) {
          console.log("Spostamento attività dalla fascia oraria", activityItem.sourceTimeSlot, "a", time);
          onRemoveActivity(activityItem.id, activityItem.sourceTimeSlot);
        }
        
        // Aggiorna con la nuova fascia oraria
        onActivityDrop(courtId, time, activityItem);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [courtId, time, onDrop, onActivityDrop, onRemovePerson, onRemoveActivity]);

  return (
    <div 
      ref={drop}
      className={`border-t border-gray-200 p-2 min-h-[80px] relative ${
        isOver ? "bg-ath-red-clay-dark/40" : ""
      }`}
      data-time={time}  // Aggiungi un attributo data per facilitare il debug
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
