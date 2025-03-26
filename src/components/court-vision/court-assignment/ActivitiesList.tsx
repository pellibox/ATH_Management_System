
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ActivityData } from "../types";
import { ACTIVITY_TYPES } from "../constants";

interface ActivitiesListProps {
  activities: ActivityData[];
  showAssigned: boolean;
  selectedTimeSlot?: string;
  onAssign?: (activity: ActivityData) => void;
  onRemove?: (activityId: string, timeSlot?: string) => void;
}

export function ActivitiesList({ 
  activities, 
  showAssigned, 
  selectedTimeSlot,
  onAssign,
  onRemove 
}: ActivitiesListProps) {
  if (activities.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-2">
        {showAssigned ? "No activities assigned to this court" : "All activities assigned to courts"}
      </div>
    );
  }

  // Filter by time slot if applicable
  const filteredActivities = selectedTimeSlot 
    ? activities.filter(activity => !activity.startTime || activity.startTime === selectedTimeSlot) 
    : activities;

  return (
    <div className="space-y-2">
      {filteredActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between p-2 border rounded"
        >
          <div className="flex items-center">
            <div
              className={`px-2 py-1 rounded-full text-xs mr-2 ${
                activity.type === ACTIVITY_TYPES.MATCH
                  ? "bg-ath-black-light text-white"
                  : activity.type === ACTIVITY_TYPES.TRAINING
                  ? "bg-ath-red-clay-dark text-white"
                  : activity.type === ACTIVITY_TYPES.BASKET_DRILL
                  ? "bg-ath-red-clay text-white"
                  : activity.type === ACTIVITY_TYPES.GAME
                  ? "bg-ath-black text-white"
                  : "bg-ath-gray-medium text-white"
              }`}
            >
              {activity.name}
            </div>
          </div>
          {showAssigned && onRemove ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemove(activity.id, activity.startTime)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Remove
            </Button>
          ) : onAssign ? (
            <Button
              size="sm"
              className="bg-ath-red-clay hover:bg-ath-red-clay-dark"
              onClick={() => onAssign(activity)}
            >
              Assign
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
