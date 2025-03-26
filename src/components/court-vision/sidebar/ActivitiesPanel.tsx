
import { PlaySquare } from "lucide-react";
import { AvailableActivities } from "../AvailableActivities";
import { useCourtVision } from "../context/CourtVisionContext";

export function ActivitiesPanel() {
  const { 
    activities,
    handleActivityDrop,
    handleAddActivity
  } = useCourtVision();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mt-4">
      <div className="flex items-center mb-3">
        <PlaySquare className="h-4 w-4 mr-2" />
        <h3 className="text-sm font-medium">Attività</h3>
      </div>
      
      <AvailableActivities 
        activities={activities}
        onAddActivity={handleAddActivity}
        onActivityDrop={handleActivityDrop}
      />
    </div>
  );
}
