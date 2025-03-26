
import { useState } from "react";
import { Activity, PlaySquare } from "lucide-react";
import { ActivityData } from "./types";
import { ACTIVITY_TYPES } from "./constants";

export interface AvailableActivitiesProps {
  activities: ActivityData[];
  onAddActivity: (activity: {name: string, type: string, duration: string}) => void;
  onRemoveActivity?: (id: string) => void;
  onActivityDrop?: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
}

export function AvailableActivities({ 
  activities, 
  onAddActivity, 
  onRemoveActivity,
  onActivityDrop 
}: AvailableActivitiesProps) {
  const [newActivity, setNewActivity] = useState({ 
    name: "", 
    type: ACTIVITY_TYPES.MATCH,
    duration: "1h"
  });
  
  const handleAddActivity = () => {
    if (!newActivity.name.trim()) return;
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
    <div className="space-y-3">
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nome Attività"
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
              <option value={ACTIVITY_TYPES.OTHER}>Altro</option>
            </select>
            
            <select
              className="px-3 py-2 text-sm border rounded"
              value={newActivity.duration}
              onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
            >
              <option value="30m">30 minuti</option>
              <option value="45m">45 minuti</option>
              <option value="1h">1 ora</option>
              <option value="1.5h">1.5 ore</option>
              <option value="2h">2 ore</option>
            </select>
          </div>
          
          <button
            className="w-full bg-green-500 text-white text-sm py-1.5 rounded hover:bg-green-600 transition-colors"
            onClick={handleAddActivity}
            disabled={!newActivity.name.trim()}
          >
            Aggiungi Attività
          </button>
        </div>
      </div>

      <div className="max-h-[180px] overflow-y-auto">
        {activities.length > 0 ? (
          <div className="space-y-1">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-2.5 border rounded-md hover:bg-gray-50 transition-colors cursor-grab"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/json", JSON.stringify(activity));
                }}
              >
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-full text-xs mr-2 ${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </div>
                  <span className="text-sm font-medium">{activity.name}</span>
                  <span className="text-xs ml-2 text-gray-500">{activity.duration}</span>
                </div>
                <button
                  onClick={() => onRemoveActivity && onRemoveActivity(activity.id)}
                  className="ml-auto text-gray-400 hover:text-red-500 p-1"
                  aria-label="Remove activity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic p-2 text-center bg-gray-50 rounded-md">
            Nessuna attività disponibile
          </div>
        )}
      </div>
    </div>
  );
}
