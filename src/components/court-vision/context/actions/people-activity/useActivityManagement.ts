
import { ActivityData } from "../../../types";
import { useToast } from "@/hooks/use-toast";
import { ActivityManagementProps } from "./types";

export const useActivityManagement = ({
  activities,
  setActivities
}: ActivityManagementProps) => {
  const { toast } = useToast();

  const handleAddActivity = (activityData: ActivityData | {name: string, type: string, duration: string}) => {
    if ('id' in activityData) {
      setActivities([...activities, activityData as ActivityData]);
      
      toast({
        title: "Attività Aggiunta",
        description: `${activityData.name} è stata aggiunta alla lista`,
      });
      
      return;
    }
    
    const newActivity: ActivityData = {
      id: `new-activity-${Date.now()}`,
      name: activityData.name,
      type: activityData.type,
      duration: activityData.duration,
    };
    
    setActivities([...activities, newActivity]);
    
    toast({
      title: "Attività Aggiunta",
      description: `${newActivity.name} è stata aggiunta alla lista`,
    });
  };

  const handleUpdateActivity = (activityId: string, updatedData: Partial<ActivityData>) => {
    setActivities(activities.map(activity => 
      activity.id === activityId ? { ...activity, ...updatedData } : activity
    ));
    
    toast({
      title: "Attività Aggiornata",
      description: "L'attività è stata aggiornata con successo",
    });
  };

  const handleRemoveActivity = (activityId: string) => {
    setActivities(activities.filter(activity => activity.id !== activityId));
    
    toast({
      title: "Attività Rimossa",
      description: "L'attività è stata rimossa dalla lista",
    });
  };

  return {
    handleAddActivity,
    handleUpdateActivity,
    handleRemoveActivity
  };
};
