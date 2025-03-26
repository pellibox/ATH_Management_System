
import { useToast } from "@/hooks/use-toast";
import { PlayerActionsProps } from "./types";

export const useMessagePlayer = ({ 
  messagePlayer, 
  setMessagePlayer,
  setMessageContent
}: PlayerActionsProps) => {
  const { toast } = useToast();

  // Handle sending a message or schedule
  const handleSendMessage = () => {
    if (!messagePlayer) return;
    
    // Use optional chaining for preferredContactMethod
    const method = messagePlayer.preferredContactMethod || "WhatsApp";
    
    toast({
      title: `Message Sent via ${method}`,
      description: `Your schedule has been sent to ${messagePlayer.name}.`,
    });
    
    setMessagePlayer(null);
    setMessageContent("");
  };

  // Handle schedule activity
  const handleScheduleActivity = (playerId: string, activityIds: string[]) => {
    // Implementation for scheduling activities
    console.log(`Scheduling activities ${activityIds.join(', ')} for player ${playerId}`);
    
    // Get player name for toast - we'll have to do this outside since we don't have players here
    const playerName = "Player"; // Fallback name
    
    toast({
      title: "Activities Scheduled",
      description: `Activities have been scheduled for ${playerName}.`,
    });
  };

  return { handleSendMessage, handleScheduleActivity };
};
