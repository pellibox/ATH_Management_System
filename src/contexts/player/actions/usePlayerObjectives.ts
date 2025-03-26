
import { useToast } from "@/hooks/use-toast";
import { Player } from "@/types/player";
import { PlayerActionsProps } from "./types";

export const usePlayerObjectives = ({ 
  players, 
  setPlayers,
  editingPlayer,
  setEditingPlayer,
  setObjectives
}: PlayerActionsProps) => {
  const { toast } = useToast();

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

  // Handle player objective change
  const handlePlayerObjectiveChange = (objectiveKey: string, value: any) => {
    if (!editingPlayer) return;
    
    const updatedObjectives = { 
      ...(editingPlayer.objectives || {
        daily: "",
        weekly: "",
        monthly: "",
        seasonal: ""
      }), 
      [objectiveKey]: value 
    };
    
    setEditingPlayer({
      ...editingPlayer,
      objectives: updatedObjectives
    });
  };

  return { 
    handleSetObjectives,
    handleEditPlayerObjectives,
    handlePlayerObjectiveChange
  };
};
