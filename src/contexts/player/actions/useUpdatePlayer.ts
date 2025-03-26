
import { useToast } from "@/hooks/use-toast";
import { PlayerActionsProps } from "./types";

export const useUpdatePlayer = ({ 
  players, 
  setPlayers, 
  editingPlayer,
  setEditingPlayer 
}: PlayerActionsProps) => {
  const { toast } = useToast();

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

  return { handleUpdatePlayer };
};
