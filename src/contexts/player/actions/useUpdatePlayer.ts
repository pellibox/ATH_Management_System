
import { useToast } from "@/hooks/use-toast";
import { PlayerActionsProps } from "./types";
import { Player } from "@/types/player";
import { useState } from "react";

export const useUpdatePlayer = ({ 
  players,
  setPlayers,
  editingPlayer,
  setEditingPlayer 
}: PlayerActionsProps) => {
  const { toast } = useToast();
  const [showProgramMismatchDialog, setShowProgramMismatchDialog] = useState(false);
  const [pendingCoachAssignment, setPendingCoachAssignment] = useState<{
    playerId: string;
    coachId: string;
  } | null>(null);

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers(
      players.map((player) =>
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );
    
    toast({
      title: "Giocatore aggiornato",
      description: `${updatedPlayer.name} è stato aggiornato con successo`,
    });

    // Close the edit modal after updating
    setEditingPlayer(null);
  };

  const handleAssignCoach = (playerId: string, coachId: string, force = false) => {
    // Find player and coach
    const player = players.find(p => p.id === playerId);
    const coachesWithPrograms = players.filter(p => p.coach === coachId && p.programs);
    
    if (!player) return;
    
    // Check if coach exists in the players list
    const coach = players.find(p => p.id === coachId);
    if (!coach) {
      toast({
        title: "Coach non trovato",
        description: "Il coach selezionato non esiste nel sistema",
        variant: "destructive"
      });
      return;
    }
    
    // If force is true, we skip program compatibility check
    if (force) {
      const updatedPlayer = { ...player, coach: coachId };
      handleUpdatePlayer(updatedPlayer);
      
      toast({
        title: "Eccezione autorizzata",
        description: `Il coach è stato assegnato a ${player.name} nonostante i programmi non corrispondano`,
      });
      
      setPendingCoachAssignment(null);
      return;
    }
    
    // Check program compatibility
    const playerProgram = player.program;
    const coachPrograms = coachesWithPrograms.flatMap(c => c.programs || []);
    
    // If player has no program, or coach has the same program, assign directly
    if (!playerProgram || coachPrograms.includes(playerProgram)) {
      const updatedPlayer = { ...player, coach: coachId };
      handleUpdatePlayer(updatedPlayer);
    } else {
      // Store pending assignment and show confirmation dialog
      setPendingCoachAssignment({ playerId, coachId });
      setShowProgramMismatchDialog(true);
      
      toast({
        title: "Programmi non compatibili",
        description: "Il coach selezionato non ha lo stesso programma del giocatore. Conferma per procedere come eccezione.",
        variant: "destructive",
        action: (
          <div className="flex space-x-2">
            <button 
              onClick={() => handleAssignCoach(playerId, coachId, true)}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Autorizza
            </button>
            <button 
              onClick={() => setPendingCoachAssignment(null)}
              className="px-3 py-1 text-xs bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Annulla
            </button>
          </div>
        )
      });
    }
  };

  const confirmCoachAssignment = () => {
    if (pendingCoachAssignment) {
      handleAssignCoach(
        pendingCoachAssignment.playerId, 
        pendingCoachAssignment.coachId, 
        true
      );
    }
    setShowProgramMismatchDialog(false);
  };

  const cancelCoachAssignment = () => {
    setPendingCoachAssignment(null);
    setShowProgramMismatchDialog(false);
  };

  return {
    handleUpdatePlayer,
    handleAssignCoach,
    showProgramMismatchDialog,
    confirmCoachAssignment,
    cancelCoachAssignment,
    pendingCoachAssignment
  };
};
