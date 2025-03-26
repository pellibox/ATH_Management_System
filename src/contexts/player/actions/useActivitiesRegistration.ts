
import { useToast } from "@/hooks/use-toast";
import { PlayerActionsProps } from "./types";
import { Player } from "@/types/player";

export const useActivitiesRegistration = ({ 
  players,
  extraActivities, 
  setExtraActivities,
  selectedActivities,
  setSelectedActivities 
}: PlayerActionsProps) => {
  const { toast } = useToast();

  // Handle registering player for activities
  const handleRegisterForActivities = (playerId: string) => {
    if (selectedActivities.length === 0) {
      toast({
        title: "No Activities Selected",
        description: "Please select at least one activity to register.",
        variant: "destructive",
      });
      return;
    }

    // Update the activities with the player
    const updatedActivities = extraActivities.map(activity => {
      if (selectedActivities.includes(activity.id)) {
        // Check if player is already registered
        if (!activity.participants.includes(playerId)) {
          return {
            ...activity,
            participants: [...activity.participants, playerId]
          };
        }
      }
      return activity;
    });

    setExtraActivities(updatedActivities);
    
    // Get player name for toast
    const playerName = players.find(p => p.id === playerId)?.name || "Player";
    
    toast({
      title: "Registration Successful",
      description: `${playerName} has been registered for ${selectedActivities.length} activities.`,
    });
    
    // Reset selected activities
    setSelectedActivities([]);
  };

  // Return both function names for compatibility
  return { 
    handleRegisterForActivities,
    handleRegisterActivity: (player: Player, activityIds: string[]) => {
      // This is a wrapper function to match the expected interface
      if (activityIds.length > 0) {
        setSelectedActivities(activityIds);
        handleRegisterForActivities(player.id);
      }
    }
  };
};
