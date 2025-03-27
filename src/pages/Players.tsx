
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
import { useEffect, useCallback, memo } from "react";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";

// Memorizziamo il componente per evitare re-render inutili
const MemoizedPlayerFilters = memo(PlayerFilters);
const MemoizedPlayerList = memo(PlayerList);

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
  
  // Sincronizzazione ottimizzata con useCallback per evitare la creazione di nuove funzioni ad ogni render
  const syncPlayersWithSharedContext = useCallback(() => {
    console.log("PlayersContent: Syncing players with shared context", players);
    
    // Utilizziamo un batch di aggiornamenti invece di aggiornare ogni giocatore singolarmente
    const playersToUpdate = [...players];
    playersToUpdate.forEach(player => {
      updatePlayer(player);
    });
  }, [players, updatePlayer]);
  
  // Usiamo uno stato più stabile riducendo la frequenza degli aggiornamenti
  useEffect(() => {
    // Aggiungiamo un minimo delay per ridurre il carico di aggiornamenti simultanei
    const timeoutId = setTimeout(() => {
      syncPlayersWithSharedContext();
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [syncPlayersWithSharedContext]);
  
  // Memorizziamo queste funzioni per evitare la creazione di nuove ad ogni render
  const handleAddPlayerWithSync = useCallback((player) => {
    const result = handleAddPlayer(player);
    // Aggiungiamo un leggero timeout per evitare aggiornamenti simultanei che causano lag
    setTimeout(() => addPlayer(player), 10);
    return result;
  }, [handleAddPlayer, addPlayer]);
  
  const handleUpdatePlayerWithSync = useCallback((player) => {
    const result = handleUpdatePlayer(player);
    // Aggiungiamo un leggero timeout per evitare aggiornamenti simultanei che causano lag
    setTimeout(() => updatePlayer(player), 10);
    return result;
  }, [handleUpdatePlayer, updatePlayer]);
  
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
      
      <MemoizedPlayerFilters />
      <MemoizedPlayerList />
      
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

// Utilizziamo React.memo anche sul contenitore principale per ridurre i re-render
const MemoizedPlayersContent = memo(PlayersContent);

export default function Players() {
  return (
    <PlayerProvider>
      <MemoizedPlayersContent />
    </PlayerProvider>
  );
}
