
import { useDrag } from "react-dnd";
import { ChartBar, Users, User } from "lucide-react";
import { ACTIVITY_TYPES } from "./constants";
import { ActivityData } from "./types";

interface ActivityProps {
  activity: ActivityData;
  onRemove: () => void;
}

export function Activity({ activity, onRemove }: ActivityProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "activity",
    item: { id: activity.id, type: activity.type, name: activity.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getActivityColor = () => {
    switch (activity.type) {
      case ACTIVITY_TYPES.MATCH:
        return "bg-purple-100 text-purple-800";
      case ACTIVITY_TYPES.TRAINING:
        return "bg-green-100 text-green-800";
      case ACTIVITY_TYPES.BASKET_DRILL:
        return "bg-yellow-100 text-yellow-800";
      case ACTIVITY_TYPES.GAME:
        return "bg-blue-100 text-blue-800";
      case ACTIVITY_TYPES.LESSON:
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = () => {
    switch (activity.type) {
      case ACTIVITY_TYPES.MATCH:
        return <ChartBar className="h-4 w-4 mr-2" />;
      case ACTIVITY_TYPES.TRAINING:
        return <Users className="h-4 w-4 mr-2" />;
      case ACTIVITY_TYPES.BASKET_DRILL:
        return <Users className="h-4 w-4 mr-2" />;
      case ACTIVITY_TYPES.GAME:
        return <Users className="h-4 w-4 mr-2" />;
      case ACTIVITY_TYPES.LESSON:
        return <User className="h-4 w-4 mr-2" />;
      default:
        return <ChartBar className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 rounded-md mb-1 ${
        isDragging ? "opacity-40" : "opacity-100"
      } ${getActivityColor()} cursor-move`}
    >
      {getActivityIcon()}
      <span className="text-sm">{activity.name}</span>
      {activity.duration && (
        <span className="text-xs ml-2">({activity.duration})</span>
      )}
      <button
        onClick={onRemove}
        className="ml-auto text-gray-500 hover:text-red-500"
        aria-label="Rimuovi attività"
      >
        ×
      </button>
    </div>
  );
}
