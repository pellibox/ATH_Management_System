
import { useState } from "react";
import { ChartBar } from "lucide-react";
import { Activity } from "./Activity";
import { ActivityData } from "./types";
import { ACTIVITY_TYPES } from "./constants";

interface AvailableActivitiesProps {
  activities: ActivityData[];
  onAddActivity: (activity: {name: string, type: string, duration: string}) => void;
  onRemoveActivity: (id: string) => void;
}

export function AvailableActivities({ activities, onAddActivity, onRemoveActivity }: AvailableActivitiesProps) {
  const [newActivity, setNewActivity] = useState({ 
    name: "", 
    type: ACTIVITY_TYPES.MATCH,
    duration: "1h"
  });

  const handleAddActivity = () => {
    onAddActivity(newActivity);
    setNewActivity({ name: "", type: ACTIVITY_TYPES.MATCH, duration: "1h" });
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <ChartBar className="h-4 w-4 mr-2" /> Available Activities
      </h2>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Add New Activity</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Activity Name"
            className="w-full px-3 py-2 text-sm border rounded"
            value={newActivity.name}
            onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
          />
          <select
            className="w-full px-3 py-2 text-sm border rounded"
            value={newActivity.type}
            onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
          >
            <option value={ACTIVITY_TYPES.MATCH}>Match</option>
            <option value={ACTIVITY_TYPES.TRAINING}>Training</option>
            <option value={ACTIVITY_TYPES.BASKET_DRILL}>Basket Drill</option>
            <option value={ACTIVITY_TYPES.GAME}>Game</option>
            <option value={ACTIVITY_TYPES.LESSON}>Lesson</option>
          </select>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Duration:</span>
            <select
              className="flex-1 px-3 py-2 text-sm border rounded"
              value={newActivity.duration}
              onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
            >
              <option value="30m">30 minutes</option>
              <option value="45m">45 minutes</option>
              <option value="1h">1 hour</option>
              <option value="1.5h">1.5 hours</option>
              <option value="2h">2 hours</option>
            </select>
          </div>
          <button
            className="w-full bg-green-500 text-white text-sm py-1.5 rounded hover:bg-green-600 transition-colors"
            onClick={handleAddActivity}
          >
            Add Activity
          </button>
        </div>
      </div>

      <div className="max-h-[180px] overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <Activity
              key={activity.id}
              activity={activity}
              onRemove={() => onRemoveActivity(activity.id)}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 italic p-2">
            All activities assigned to courts
          </div>
        )}
      </div>
    </div>
  );
}
