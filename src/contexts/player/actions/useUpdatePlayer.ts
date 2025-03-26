
import { useToast } from "@/hooks/use-toast";
import { PlayerActionsProps } from "./types";
import { Player } from "@/types/player";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";

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

    setEditingPlayer(null);
  };

  const handleAssignCoach = (playerId: string, coachId: string, force = false) => {
    const player = players.find(p => p.id === playerId);
    const coachesWithPrograms = players.filter(p => p.coach === coachId && p.programs);
    
    if (!player) return;
    
    const coach = players.find(p => p.id === coachId);
    if (!coach) {
      toast({
        title: "Coach non trovato",
        description: "Il coach selezionato non esiste nel sistema",
        variant: "destructive"
      });
      return;
    }
    
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
    
    const playerProgram = player.program;
    const coachPrograms = coachesWithPrograms.flatMap(c => c.programs || []);
    
    if (!playerProgram || coachPrograms.includes(playerProgram)) {
      const updatedPlayer = { ...player, coach: coachId };
      handleUpdatePlayer(updatedPlayer);
    } else {
      setPendingCoachAssignment({ playerId, coachId });
      setShowProgramMismatchDialog(true);
      
      toast({
        title: "Programmi non compatibili",
        description: "Il coach selezionato non ha lo stesso programma del giocatore. Conferma per procedere come eccezione.",
        variant: "destructive",
        action: <ToastAction altText="Autorizza" onClick={() => handleAssignCoach(playerId, coachId, true)}>
          Autorizza
        </ToastAction>
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
