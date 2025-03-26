
import { useToast } from "@/hooks/use-toast";
import { PlayerActionsProps } from "./types";

export const useDeletePlayer = ({ 
  players, 
  setPlayers 
}: PlayerActionsProps) => {
  const { toast } = useToast();

  // Handle deleting a player
  const handleDeletePlayer = (id: string, name: string) => {
    setPlayers(players.filter(player => player.id !== id));
    
    toast({
      title: "Player Deleted",
      description: `${name} has been removed from the database.`,
      variant: "destructive",
    });
  };

  return { handleDeletePlayer };
};
