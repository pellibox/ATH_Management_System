
import { useToast } from "@/hooks/use-toast";
import { PlayerActionsProps } from "./types";

export const useDeletePlayer = ({ 
  players, 
  setPlayers,
  setEditingPlayer 
}: PlayerActionsProps) => {
  const { toast } = useToast();

  // Update to use a single parameter to match the interface
  const handleDeletePlayer = (id: string) => {
    const playerToDelete = players.find(p => p.id === id);
    if (!playerToDelete) return;
    
    const playerName = playerToDelete.name;
    
    setPlayers(players.filter(p => p.id !== id));
    setEditingPlayer(null);
    
    toast({
      title: "Giocatore Rimosso",
      description: `${playerName} è stato rimosso con successo`
    });
  };

  return { handleDeletePlayer };
};
