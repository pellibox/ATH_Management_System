
import { useToast } from "@/hooks/use-toast";
import { Player } from "@/types/player";
import { PlayerActionsProps } from "./types";

export const useAddPlayer = ({ players, setPlayers }: PlayerActionsProps) => {
  const { toast } = useToast();

  // Handle adding a new player
  const handleAddPlayer = (playerData: Omit<Player, "id">) => {
    const newId = `p${Date.now()}`;
    
    const newPlayer: Player = {
      id: newId,
      ...playerData
    };
    
    setPlayers([
      ...players,
      newPlayer
    ]);
    
    toast({
      title: "Player Added",
      description: `${playerData.name} has been added to the database.`,
    });
  };

  return { handleAddPlayer };
};
