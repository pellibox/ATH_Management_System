
import { useToast } from "@/hooks/use-toast";
import { PlayerActionsProps } from "./types";
import { Player } from "@/types/player";
import { useState, useCallback } from "react";
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

  // Ottimizziamo con useCallback per evitare ricreazioni inutili
  const handleUpdatePlayer = useCallback((updatedPlayer: Player) => {
    try {
      if (!updatedPlayer || !updatedPlayer.id) {
        console.error("Invalid player data:", updatedPlayer);
        toast({
          title: "Errore",
          description: "Dati del giocatore non validi",
          variant: "destructive"
        });
        return;
      }
      
      // Utilizziamo una funzione per l'update che non causa re-render non necessari
      setPlayers(prevPlayers => {
        // Controlliamo se il giocatore è effettivamente cambiato
        const playerIndex = prevPlayers.findIndex(p => p.id === updatedPlayer.id);
        if (playerIndex === -1) return prevPlayers;
        
        const currentPlayer = prevPlayers[playerIndex];
        // Confronto superficiale per verificare se ci sono cambiamenti
        if (JSON.stringify(currentPlayer) === JSON.stringify(updatedPlayer)) {
          return prevPlayers; // Nessun cambiamento, non aggiorniamo lo stato
        }
        
        // Creiamo un nuovo array con il giocatore aggiornato
        const newPlayers = [...prevPlayers];
        newPlayers[playerIndex] = updatedPlayer;
        return newPlayers;
      });
      
      toast({
        title: "Giocatore aggiornato",
        description: `${updatedPlayer.name} è stato aggiornato con successo`,
      });

      // Ritardiamo il reset di editingPlayer per evitare problemi di rendering
      setTimeout(() => {
        setEditingPlayer(null);
      }, 50);
    } catch (error) {
      console.error("Error updating player:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento",
        variant: "destructive"
      });
    }
  }, [setPlayers, setEditingPlayer, toast]);

  // Ottimizziamo con useCallback
  const handleAssignCoach = useCallback((playerId: string, coachId: string, force = false) => {
    const player = players.find(p => p.id === playerId);
    
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
    
    // Se force è true, aggiorniamo il giocatore immediatamente
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
    
    // Controlliamo la compatibilità dei programmi
    const coachesWithPrograms = players.filter(p => p.coach === coachId && p.programs);
    const playerProgram = player.program;
    
    // Se non ci sono problemi di compatibilità, procediamo con l'aggiornamento
    if (!playerProgram || playerProgram === "" || coachesWithPrograms.some(c => 
      c.programs?.includes(playerProgram)
    )) {
      const updatedPlayer = { ...player, coach: coachId };
      handleUpdatePlayer(updatedPlayer);
    } else {
      // Altrimenti, salviamo l'assegnazione in sospeso e mostriamo un dialog
      setPendingCoachAssignment({ playerId, coachId });
      setShowProgramMismatchDialog(true);
      
      toast({
        title: "Programmi non compatibili",
        description: "Il coach selezionato non ha lo stesso programma del giocatore. Conferma per procedere come eccezione.",
        variant: "destructive",
        action: <ToastAction altText="Autorizza" onClick={() => handleAssignCoach(playerId, coachId, true)}>Autorizza</ToastAction>
      });
    }
  }, [players, handleUpdatePlayer, toast]);

  // Ottimizziamo le altre funzioni con useCallback
  const confirmCoachAssignment = useCallback(() => {
    if (pendingCoachAssignment) {
      handleAssignCoach(
        pendingCoachAssignment.playerId, 
        pendingCoachAssignment.coachId, 
        true
      );
    }
    setShowProgramMismatchDialog(false);
  }, [pendingCoachAssignment, handleAssignCoach]);

  const cancelCoachAssignment = useCallback(() => {
    setPendingCoachAssignment(null);
    setShowProgramMismatchDialog(false);
  }, []);

  return {
    handleUpdatePlayer,
    handleAssignCoach,
    showProgramMismatchDialog,
    confirmCoachAssignment,
    cancelCoachAssignment,
    pendingCoachAssignment
  };
};
