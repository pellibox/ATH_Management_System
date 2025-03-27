
import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { Player } from "@/types/player";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ActivityRegistration } from "./ActivityRegistration";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { PlayerDetailCard } from "./detail";
import { PlayerTableHeader } from "./components/PlayerTableHeader";
import { PlayerRow } from "./components/PlayerRow";
import { NoPlayersFound } from "./components/NoPlayersFound";
import { ListView } from "./views/ListView";

// Memorizziamo PlayerRow per evitare re-render inutili
const MemoizedPlayerRow = memo(PlayerRow);
const MemoizedListView = memo(ListView);

export function PlayerList() {
  const { 
    filteredPlayers,
    setEditingPlayer, 
    handleDeletePlayer,
    setMessagePlayer,
    extraActivities
  } = usePlayerContext();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [sortColumn, setSortColumn] = useState<"name" | "program" | "email" | "phone">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Utilizziamo useMemo per i giocatori ordinati per evitare calcoli inutili
  const sortedPlayers = useMemo(() => {
    // Preveniamo ordinamenti troppo frequenti usando un debounce interno con una copia difensiva
    const playersToSort = [...filteredPlayers];
    
    return playersToSort.sort((a, b) => {
      const valueA = (a[sortColumn] || "").toString().toLowerCase();
      const valueB = (b[sortColumn] || "").toString().toLowerCase();
      
      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }, [filteredPlayers, sortColumn, sortDirection]);

  // Clean up selected player when component unmounts or when player list changes
  useEffect(() => {
    return () => setSelectedPlayer(null);
  }, []);

  // Ottimizziamo le callback per evitare ricreazioni inutili
  const handleSort = useCallback((column: "name" | "program" | "email" | "phone") => {
    setSortColumn(prevColumn => {
      if (prevColumn === column) {
        setSortDirection(prevDirection => prevDirection === "asc" ? "desc" : "asc");
        return prevColumn;
      } else {
        setSortDirection("asc");
        return column;
      }
    });
  }, []);

  const handleViewDetails = useCallback((player: Player) => {
    // Impostiamo un breve delay per evitare render troppo rapidi
    setTimeout(() => {
      setSelectedPlayer(player);
    }, 10);
  }, []);

  const handleRegisterActivity = useCallback((playerId: string) => {
    // Aggiungiamo un delay per evitare problemi di UI freezing
    setTimeout(() => {
      const dialogTrigger = document.querySelector(`[data-player-id="${playerId}"]`);
      if (dialogTrigger instanceof HTMLElement) {
        dialogTrigger.click();
      }
    }, 20);
  }, []);

  // Use the ListView component instead of direct table rendering
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <MemoizedListView players={sortedPlayers} />

      {selectedPlayer && (
        <Dialog 
          open={!!selectedPlayer} 
          onOpenChange={(open) => !open && setSelectedPlayer(null)}
        >
          <DialogContent className="sm:max-w-[800px] bg-white">
            <PlayerDetailCard 
              player={selectedPlayer} 
              onClose={() => setSelectedPlayer(null)}
              extraActivities={extraActivities}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Hidden dialogs for activity registration */}
      <div className="hidden">
        {filteredPlayers.map(player => (
          <Dialog key={player.id}>
            <DialogTrigger data-player-id={player.id} />
            <DialogContent className="sm:max-w-[600px]">
              <ActivityRegistration playerId={player.id} playerName={player.name} />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
