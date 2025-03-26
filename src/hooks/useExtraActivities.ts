
import { useState } from "react";
import { ExtraActivity } from "@/types/extra-activities";
import { useToast } from "@/hooks/use-toast";

export function useExtraActivities(initialActivities: ExtraActivity[] = []) {
  const { toast } = useToast();
  const [activities, setActivities] = useState<ExtraActivity[]>(initialActivities);
  
  // Add a new activity
  const handleAddActivity = (newActivity: ExtraActivity) => {
    setActivities([...activities, newActivity]);
    
    toast({
      title: "Attività Aggiunta",
      description: `${newActivity.name} è stata aggiunta con successo`,
    });
  };
  
  // Edit an existing activity
  const handleEditActivity = (id: string, updatedActivity: Partial<ExtraActivity>) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, ...updatedActivity } : activity
    ));
    
    toast({
      title: "Attività Aggiornata",
      description: "Le modifiche sono state salvate con successo",
    });
  };
  
  // Delete an activity
  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
    
    toast({
      title: "Attività Eliminata",
      description: "L'attività è stata eliminata con successo",
    });
  };
  
  // Add a participant to an activity
  const handleAddParticipant = (activityId: string, participantId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId && !activity.participants.includes(participantId)) {
        return {
          ...activity,
          participants: [...activity.participants, participantId]
        };
      }
      return activity;
    }));
    
    toast({
      title: "Partecipante Aggiunto",
      description: "Il partecipante è stato aggiunto all'attività",
    });
  };
  
  // Remove a participant from an activity
  const handleRemoveParticipant = (activityId: string, participantId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          participants: activity.participants.filter(id => id !== participantId)
        };
      }
      return activity;
    }));
    
    toast({
      title: "Partecipante Rimosso",
      description: "Il partecipante è stato rimosso dall'attività",
    });
  };

  // Get activities for a specific date
  const getActivitiesForDate = (selectedDate: Date) => {
    return activities.filter(activity => 
      activity.days.includes(selectedDate.getDay() === 0 ? 7 : selectedDate.getDay())
    );
  };

  return {
    activities,
    handleAddActivity,
    handleEditActivity,
    handleDeleteActivity,
    handleAddParticipant,
    handleRemoveParticipant,
    getActivitiesForDate
  };
}
