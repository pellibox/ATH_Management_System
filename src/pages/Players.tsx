
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
import { useEffect, useCallback, memo, useMemo } from "react";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";

// Memorizziamo i componenti per evitare re-render inutili
const MemoizedPlayerFilters = memo(PlayerFilters);
const MemoizedPlayerList = memo(PlayerList);

// Limitiamo la frequenza di sincronizzazione
const SYNC_THROTTLE_MS = 300;

// Extract program names from the TENNIS_PROGRAMS constant
const getAvailablePrograms = () => {
  const programNames: string[] = [];
  
  // Flatten all categories into a single array of names
  Object.values(TENNIS_PROGRAMS).forEach(categoryPrograms => {
    if (Array.isArray(categoryPrograms)) {
      categoryPrograms.forEach(program => {
        if (program.name) {
          programNames.push(program.name);
        }
      });
    }
  });
  
  return programNames;
};

function PlayersContent() {
  const { 
    editingPlayer, 
    messagePlayer, 
    handleAddPlayer, 
    handleUpdatePlayer,
    setEditingPlayer,
    setMessagePlayer,
    players,
    setAvailablePrograms
  } = usePlayerContext();
  
  // Get shared player context
  const { addPlayer, updatePlayer } = useSharedPlayers();
  
  // Set available programs from TENNIS_PROGRAMS
  useEffect(() => {
    const programs = getAvailablePrograms();
    setAvailablePrograms(programs);
  }, [setAvailablePrograms]);
  
  // Memorizziamo questa funzione per evitare sincronizzazioni eccessive
  const syncPlayersWithSharedContext = useCallback(() => {
    console.log("PlayersContent: Syncing players with shared context", players);
    
    // Implementiamo un batch più efficiente per evitare aggiornamenti troppo frequenti
    const lastThreePlayers = players.slice(-3);
    
    // Limitiamo gli aggiornamenti solo ai player recenti per ridurre il carico
    lastThreePlayers.forEach(player => {
      updatePlayer(player);
    });
  }, [players, updatePlayer]);
  
  // Usiamo uno stato più stabile riducendo ulteriormente la frequenza degli aggiornamenti
  useEffect(() => {
    // Aumentiamo il delay per ridurre la frequenza di aggiornamento
    const timeoutId = setTimeout(() => {
      syncPlayersWithSharedContext();
    }, SYNC_THROTTLE_MS);
    
    return () => clearTimeout(timeoutId);
  }, [syncPlayersWithSharedContext]);
  
  // Memorizziamo queste funzioni per evitare la creazione di nuove ad ogni render
  const handleAddPlayerWithSync = useCallback((player) => {
    const result = handleAddPlayer(player);
    // Utilizziamo un delay maggiore per evitare aggiornamenti troppo frequenti
    setTimeout(() => addPlayer(player), 200);
    return result;
  }, [handleAddPlayer, addPlayer]);
  
  const handleUpdatePlayerWithSync = useCallback((player) => {
    const result = handleUpdatePlayer(player);
    // Utilizziamo un delay maggiore per evitare aggiornamenti troppo frequenti
    setTimeout(() => updatePlayer(player), 200);
    return result;
  }, [handleUpdatePlayer, updatePlayer]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      setEditingPlayer(null);
      setMessagePlayer(null);
    };
  }, [setEditingPlayer, setMessagePlayer]);

  // Memoriziamo elementi UI per renderli solo quando necessario
  const dialogForms = useMemo(() => (
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
  ), [editingPlayer, messagePlayer, handleUpdatePlayerWithSync, setEditingPlayer, setMessagePlayer]);
  
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
      
      {dialogForms}
    </div>
  );
}

// Utilizziamo React.memo con un comparatore personalizzato per evitare re-render non necessari
const MemoizedPlayersContent = memo(PlayersContent, (prevProps, nextProps) => {
  // Poiché non ci sono props da confrontare, restituiamo true per evitare re-render
  return true;
});

export default function Players() {
  return (
    <PlayerProvider>
      <MemoizedPlayersContent />
    </PlayerProvider>
  );
}
