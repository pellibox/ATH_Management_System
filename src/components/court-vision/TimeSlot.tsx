
import { useState } from "react";
import { useDrop } from "react-dnd";
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
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity"],
    drop: (item: any) => {
      if (item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) {
        onDrop(courtId, time, item as PersonData);
      } else {
        onActivityDrop(courtId, time, item as ActivityData);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={`border-t border-gray-200 p-2 min-h-[80px] relative ${
        isOver ? "bg-ath-red-clay-dark/30" : ""
      }`}
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
            <div 
              key={activity.id}
              className={`text-xs px-2 py-0.5 rounded-sm flex items-center ${
                activity.type === ACTIVITY_TYPES.MATCH 
                  ? "bg-ath-black-light text-white" 
                  : activity.type === ACTIVITY_TYPES.TRAINING
                  ? "bg-ath-red-clay-dark text-white"
                  : activity.type === ACTIVITY_TYPES.BASKET_DRILL
                  ? "bg-ath-red-clay-dark text-white" /* Darkened clay color */
                  : activity.type === ACTIVITY_TYPES.GAME
                  ? "bg-ath-black text-white"
                  : "bg-ath-gray-medium text-white"
              }`}
            >
              {activity.name}
              <button
                onClick={() => onRemoveActivity(activity.id, time)}
                className="ml-1 text-gray-300 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {occupants.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {occupants.map((person) => (
            <div 
              key={person.id}
              className={`text-xs px-2 py-0.5 rounded-sm flex items-center ${
                person.type === PERSON_TYPES.PLAYER 
                  ? "bg-ath-red-clay-dark text-white" /* Darkened clay color */ 
                  : "bg-ath-black text-white"
              }`}
            >
              {person.name.substring(0, 10)}
              <button
                onClick={() => onRemovePerson(person.id, time)}
                className="ml-1 text-gray-300 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
