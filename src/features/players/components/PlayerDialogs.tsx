
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { memo } from "react";
import { PlayerForm } from "@/components/players/PlayerForm";
import { ScheduleMessage } from "@/components/players/ScheduleMessage";
import { usePlayerContext } from "@/contexts/player/PlayerContext";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";

export const PlayerDialogs = memo(() => {
  const { 
    editingPlayer, 
    messagePlayer, 
    handleUpdatePlayer,
    setEditingPlayer,
    setMessagePlayer
  } = usePlayerContext();
  
  const { updatePlayer } = useSharedPlayers();

  const handleUpdatePlayerWithSync = (player) => {
    console.log("Players page: Updating player and syncing to shared context", player.name);
    
    // Make sure status is set explicitly
    const playerWithStatus = {
      ...player,
      status: player.status || 'active' // Default to active if not specified
    };
    
    // Update in Players context first
    const result = handleUpdatePlayer(playerWithStatus);
    
    // Then sync to shared context for Court Vision
    updatePlayer(playerWithStatus);
    
    return result;
  };

  return (
    <>
      {editingPlayer && (
        <Dialog 
          open={!!editingPlayer} 
          onOpenChange={(open) => !open && setEditingPlayer(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <PlayerForm buttonText="Aggiorna Giocatore" handleSave={handleUpdatePlayerWithSync} />
          </DialogContent>
        </Dialog>
      )}
      
      {messagePlayer && (
        <Dialog 
          open={!!messagePlayer} 
          onOpenChange={(open) => !open && setMessagePlayer(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <ScheduleMessage />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
});

PlayerDialogs.displayName = "PlayerDialogs";
