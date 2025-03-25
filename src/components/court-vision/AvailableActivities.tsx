
import { useState } from "react";
import { Activity, PlaySquare } from "lucide-react";
import { ActivityData } from "./types";
import { ACTIVITY_TYPES } from "./constants";

export interface AvailableActivitiesProps {
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

  const getActivityColor = (type: string) => {
    switch (type) {
      case ACTIVITY_TYPES.MATCH:
        return "bg-ath-black-light text-white";
      case ACTIVITY_TYPES.TRAINING:
        return "bg-ath-red-clay-dark text-white";
      case ACTIVITY_TYPES.BASKET_DRILL:
        return "bg-ath-red-clay text-white";
      case ACTIVITY_TYPES.GAME:
        return "bg-ath-black text-white";
      default:
        return "bg-ath-gray-medium text-white";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <PlaySquare className="h-4 w-4 mr-2" /> Available Activities
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
          
          <div className="grid grid-cols-2 gap-1">
            <select
              className="px-3 py-2 text-sm border rounded"
              value={newActivity.type}
              onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
            >
              <option value={ACTIVITY_TYPES.MATCH}>Match</option>
              <option value={ACTIVITY_TYPES.TRAINING}>Training</option>
              <option value={ACTIVITY_TYPES.BASKET_DRILL}>Basket Drill</option>
              <option value={ACTIVITY_TYPES.GAME}>Game</option>
              <option value={ACTIVITY_TYPES.OTHER}>Other</option>
            </select>
            
            <select
              className="px-3 py-2 text-sm border rounded"
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
          <div className="space-y-1">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center justify-between p-2 rounded ${getActivityColor(activity.type)}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/json", JSON.stringify(activity));
                }}
              >
                <div>
                  <span className="text-sm">{activity.name}</span>
                  <span className="text-xs ml-2 opacity-80">{activity.duration}</span>
                </div>
                <button
                  onClick={() => onRemoveActivity(activity.id)}
                  className="ml-auto text-white hover:text-red-200"
                  aria-label="Remove activity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic p-2">
            All activities assigned to courts
          </div>
        )}
      </div>
    </div>
  );
}
