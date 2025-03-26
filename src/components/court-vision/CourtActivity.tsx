
import { ACTIVITY_TYPES } from "./constants";
import { ActivityData } from "./types";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Trash2 } from "lucide-react";

interface CourtActivityProps {
  activity: ActivityData;
  onRemove: (activityId: string) => void;
}

export function CourtActivity({ activity, onRemove }: CourtActivityProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`text-xs px-2 py-1 rounded-full ${
            activity.type === ACTIVITY_TYPES.MATCH
              ? "bg-ath-black-light text-white"
              : activity.type === ACTIVITY_TYPES.TRAINING
              ? "bg-ath-red-clay-dark/90 text-white"
              : activity.type === ACTIVITY_TYPES.BASKET_DRILL
              ? "bg-ath-red-clay/90 text-white"
              : activity.type === ACTIVITY_TYPES.GAME
              ? "bg-ath-black text-white"
              : "bg-ath-gray-medium text-white"
          }`}
        >
          {activity.name}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-white shadow-md border border-gray-200">
        <ContextMenuItem 
          className="flex items-center text-red-500 cursor-pointer"
          onClick={() => onRemove(activity.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Rimuovi</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
