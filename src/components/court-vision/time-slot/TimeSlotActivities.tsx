
import React from "react";
import { ActivityData } from "../types";
import { CourtActivity } from "../CourtActivity";

interface TimeSlotActivitiesProps {
  activities: ActivityData[];
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  time: string;
}

export function TimeSlotActivities({ 
  activities, 
  onRemoveActivity,
  time
}: TimeSlotActivitiesProps) {
  if (!activities || activities.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {activities.map((activity) => (
        <CourtActivity
          key={`${activity.id}-${time}`}
          activity={activity}
          onRemove={() => onRemoveActivity(activity.id, time)}
        />
      ))}
    </div>
  );
}
