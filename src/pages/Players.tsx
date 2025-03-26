
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { PlayerProvider } from "@/contexts/player/PlayerContext";
import { usePlayerContext } from "@/contexts/player/PlayerContext";
import { PlayerFilters } from "@/components/players/PlayerFilters";
import { PlayerList } from "@/components/players/PlayerList";
import { ScheduleMessage } from "@/components/players/ScheduleMessage";
import { PlayerForm } from "@/components/players/PlayerForm";
import { PlayerObjectives } from "@/components/players/PlayerObjectives";
import { DialogTrigger } from "@/components/ui/dialog";
import { useEffect } from "react";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";

function PlayersContent() {
  const { 
    editingPlayer, 
    messagePlayer, 
    handleAddPlayer, 
    handleUpdatePlayer,
    setEditingPlayer,
    setMessagePlayer,
    players
  } = usePlayerContext();
  
  // Get shared player context
  const { addPlayer, updatePlayer } = useSharedPlayers();
  
  // Sync players with shared context when they change
  useEffect(() => {
    const syncPlayersWithSharedContext = () => {
      console.log("PlayersContent: Syncing players with shared context", players);
      players.forEach(player => {
        // This is a simple approach - in a real app, you'd need more sophisticated syncing
        updatePlayer(player);
      });
    };
    
    syncPlayersWithSharedContext();
  }, [players, updatePlayer]);
  
  // Wrap the add/update functions to also update shared context
  const handleAddPlayerWithSync = (player) => {
    const result = handleAddPlayer(player);
    addPlayer(player);
    return result;
  };
  
  const handleUpdatePlayerWithSync = (player) => {
    const result = handleUpdatePlayer(player);
    updatePlayer(player);
    return result;
  };
  
  // Clean up any open dialogs when component unmounts
  useEffect(() => {
    return () => {
      // Reset any open states to prevent memory leaks
      setEditingPlayer(null);
      setMessagePlayer(null);
    };
  }, [setEditingPlayer, setMessagePlayer]);
  
  return (
    <div className="max-w-7xl mx-auto">
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
      
      <PlayerFilters />
      <PlayerList />
      
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
    </div>
  );
}

export default function Players() {
  return (
    <PlayerProvider>
      <PlayersContent />
    </PlayerProvider>
  );
}
