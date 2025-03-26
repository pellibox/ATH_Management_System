
import { useToast } from "@/hooks/use-toast";
import { Player } from "@/types/player";
import { ExtraActivity } from "@/types/extra-activities";

interface PlayerActionsProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  editingPlayer: Player | null;
  setEditingPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  messagePlayer: Player | null;
  setMessagePlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  messageContent: string;
  setMessageContent: React.Dispatch<React.SetStateAction<string>>;
  extraActivities: ExtraActivity[];
  setExtraActivities: React.Dispatch<React.SetStateAction<ExtraActivity[]>>;
  selectedActivities: string[];
  setSelectedActivities: React.Dispatch<React.SetStateAction<string[]>>;
  setObjectives: React.Dispatch<React.SetStateAction<{
    daily: string;
    weekly: string;
    monthly: string;
    seasonal: string;
  }>>;
}

export const usePlayerActions = ({
  players,
  setPlayers,
  editingPlayer,
  setEditingPlayer,
  messagePlayer,
  setMessagePlayer,
  messageContent,
  setMessageContent,
  extraActivities,
  setExtraActivities,
  selectedActivities,
  setSelectedActivities,
  setObjectives
}: PlayerActionsProps) => {
  const { toast } = useToast();

  // Handle adding a new player
  const handleAddPlayer = (playerData: Omit<Player, "id">) => {
    const newId = `p${Date.now()}`;
    
    setPlayers([
      ...players,
      { id: newId, ...playerData }
    ]);
    
    toast({
      title: "Player Added",
      description: `${playerData.name} has been added to the database.`,
    });
  };

  // Handle updating a player
  const handleUpdatePlayer = () => {
    if (!editingPlayer) return;
    
    setPlayers(players.map(player => 
      player.id === editingPlayer.id ? editingPlayer : player
    ));
    
    setEditingPlayer(null);
    
    toast({
      title: "Player Updated",
      description: `${editingPlayer.name}'s information has been updated.`,
    });
  };

  // Handle deleting a player
  const handleDeletePlayer = (id: string, name: string) => {
    setPlayers(players.filter(player => player.id !== id));
    
    toast({
      title: "Player Deleted",
      description: `${name} has been removed from the database.`,
      variant: "destructive",
    });
  };

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

  // Handle setting player objectives
  const handleSetObjectives = (updatedObjectives: Player["objectives"]) => {
    if (!editingPlayer) return;
    
    const updatedPlayer = {
      ...editingPlayer,
      objectives: updatedObjectives
    };
    
    setPlayers(players.map(player => 
      player.id === updatedPlayer.id ? updatedPlayer : player
    ));
    
    setEditingPlayer(null);
    
    toast({
      title: "Objectives Set",
      description: `Training objectives for ${updatedPlayer.name} have been updated.`,
    });
  };

  // Set up an editing player for objectives tab
  const handleEditPlayerObjectives = (player: Player) => {
    setEditingPlayer(player);
    
    // Ensure all required properties are present with fallback to empty strings
    const playerObjectives = player.objectives || {
      daily: "", 
      weekly: "", 
      monthly: "", 
      seasonal: ""
    };
    
    // Create a complete objectives object with all required properties
    const completeObjectives = {
      daily: playerObjectives.daily || "",
      weekly: playerObjectives.weekly || "",
      monthly: playerObjectives.monthly || "",
      seasonal: playerObjectives.seasonal || ""
    };
    
    setObjectives(completeObjectives);
  };

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

  return {
    handleAddPlayer,
    handleUpdatePlayer,
    handleDeletePlayer,
    handleSendMessage,
    handleSetObjectives,
    handleEditPlayerObjectives,
    handleRegisterForActivities
  };
};
