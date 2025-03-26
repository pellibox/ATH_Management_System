
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
    
    setActivities([...activities, newActivity]);
    
    toast({
      title: "Attività Aggiunta",
      description: `${newActivity.name} è stata aggiunta alla lista`,
    });
  };

  return {
    handleAddActivity
  };
};
