
import { ActivityData } from "../../../types";
import { useToast } from "@/hooks/use-toast";
import { ActivityManagementProps } from "./types";

export const useActivityManagement = ({
  activities,
  setActivities
}: ActivityManagementProps) => {
  const { toast } = useToast();

  const handleAddActivity = (activityData: {name: string, type: string, duration: string}) => {
    const newActivity: ActivityData = {
      id: `new-activity-${Date.now()}`,
      name: activityData.name,
      type: activityData.type,
      duration: activityData.duration,
    };
    
    // Determine color based on activity type
    if (activityData.type === 'individuale') {
      newActivity.color = '#4CAF50'; // Green for individual activities
    } else if (activityData.type === 'gruppo') {
      newActivity.color = '#2196F3'; // Blue for group activities  
    } else if (activityData.type === 'torneo') {
      newActivity.color = '#FF9800'; // Orange for tournaments
    } else if (activityData.type === 'evento') {
      newActivity.color = '#9C27B0'; // Purple for events
    }
    
    setActivities([...activities, newActivity]);
    
    toast({
      title: "Attività Aggiunta",
      description: `${newActivity.name} è stata aggiunta alla lista`,
    });
  };

  const handleDeleteActivity = (activityId: string) => {
    const activityToDelete = activities.find(act => act.id === activityId);
    if (!activityToDelete) return;

    setActivities(activities.filter(act => act.id !== activityId));
    
    toast({
      title: "Attività Eliminata",
      description: `${activityToDelete.name} è stata rimossa dalla lista`,
    });
  };

  return {
    handleAddActivity,
    handleDeleteActivity
  };
};
