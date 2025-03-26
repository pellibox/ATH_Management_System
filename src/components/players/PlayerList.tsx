
import { useState, useEffect } from "react";
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

  // Clean up selected player when component unmounts or when player list changes
  useEffect(() => {
    return () => setSelectedPlayer(null);
  }, []);

  const handleSort = (column: "name" | "program" | "email" | "phone") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const valueA = (a[sortColumn] || "").toString().toLowerCase();
    const valueB = (b[sortColumn] || "").toString().toLowerCase();
    
    if (sortDirection === "asc") {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  const handleViewDetails = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleRegisterActivity = (playerId: string) => {
    const dialogTrigger = document.querySelector(`[data-player-id="${playerId}"]`);
    if (dialogTrigger instanceof HTMLElement) {
      dialogTrigger.click();
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <PlayerTableHeader 
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
        <TableBody>
          {sortedPlayers.length > 0 ? (
            sortedPlayers.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                onViewDetails={handleViewDetails}
                onRegisterActivity={handleRegisterActivity}
              />
            ))
          ) : (
            <NoPlayersFound />
          )}
        </TableBody>
      </Table>

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

      {filteredPlayers.map(player => (
        <div key={player.id} className="hidden">
          <Dialog>
            <DialogTrigger data-player-id={player.id} />
            <DialogContent className="sm:max-w-[600px]">
              <ActivityRegistration playerId={player.id} playerName={player.name} />
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}
