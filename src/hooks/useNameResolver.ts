
import { useCourtVision } from "@/components/court-vision/context/CourtVisionContext";

export function useNameResolver() {
  const { playersList, coachesList } = useCourtVision();
  
  // Get coach name from ID
  const getCoachName = (coachId: string) => {
    const coach = coachesList.find(c => c.id === coachId);
    return coach ? coach.name : "Coach non trovato";
  };
  
  // Get player name from ID
  const getPlayerName = (playerId: string) => {
    const player = playersList.find(p => p.id === playerId);
    return player ? player.name : "Giocatore non trovato";
  };

  return {
    playersList,
    coachesList,
    getCoachName,
    getPlayerName
  };
}
