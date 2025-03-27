
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users } from "lucide-react";
import { memo } from "react";
import { PlayerForm } from "@/components/players/PlayerForm";
import { usePlayerContext } from "@/contexts/player/PlayerContext";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";

export const PlayerHeader = memo(() => {
  const { handleAddPlayer } = usePlayerContext();
  const { addPlayer } = useSharedPlayers();

  const handleAddPlayerWithSync = (player) => {
    console.log("Players page: Adding new player and syncing to shared context", player.name);
    const result = handleAddPlayer(player);
    // Sync immediately for new players
    addPlayer(player);
    return result;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Users className="mr-3 h-8 w-8" />
          Gestione Giocatori
        </h1>
        <p className="text-gray-600 mt-1">
          Gestisci e monitora tutti i giocatori registrati nell'accademia
        </p>
      </div>
      
      <Dialog>
        <Button className="flex items-center" asChild>
          <DialogTrigger>
            <Plus className="h-4 w-4 mr-2" />
            Nuovo Giocatore
          </DialogTrigger>
        </Button>
        <DialogContent className="sm:max-w-[600px]">
          <PlayerForm
            buttonText="Aggiungi Giocatore"
            handleSave={handleAddPlayerWithSync}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
});

PlayerHeader.displayName = "PlayerHeader";
