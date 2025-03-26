import { useState } from "react";
import { Player } from "@/types/player";
import { MoreVertical, Edit, Trash2, Mail, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScheduleButton } from "./ScheduleMessage";
import { ActivityRegistration } from "./ActivityRegistration";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { PlayerDetailCard } from "./detail";

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

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <SortAsc className="h-4 w-4 ml-1 inline" />
    ) : (
      <SortDesc className="h-4 w-4 ml-1 inline" />
    );
  };

  // Get program color for player
  const getProgramColor = (program: string | undefined) => {
    if (!program) return "bg-gray-300";
    
    // Create a simple hash of the program name to get a deterministic color
    const hash = program.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"];
    return colors[hash % colors.length];
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("name")}
            >
              Nome <SortIcon column="name" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("program")}
            >
              Programma <SortIcon column="program" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("email")}
            >
              Email <SortIcon column="email" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("phone")}
            >
              Telefono <SortIcon column="phone" />
            </TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlayers.length > 0 ? (
            sortedPlayers.map((player) => (
              <TableRow 
                key={player.id} 
                className="cursor-pointer hover:bg-gray-50" 
                onClick={() => setSelectedPlayer(player)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white mr-2 ${getProgramColor(player.program)}`}>
                      {player.name.substring(0, 1).toUpperCase()}
                    </div>
                    {player.name}
                  </div>
                </TableCell>
                <TableCell>
                  {player.program ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {player.program}
                    </span>
                  ) : (
                    <span className="text-gray-500">Non assegnato</span>
                  )}
                </TableCell>
                <TableCell>{player.email}</TableCell>
                <TableCell>{player.phone}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <ActivityRegistration playerId={player.id} playerName={player.name} />
                    <ScheduleButton onClick={() => setMessagePlayer(player)} />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              setEditingPlayer(player);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifica
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </Dialog>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlayer(player.id, player.name);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Elimina
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Nessun giocatore trovato con i criteri di ricerca specificati
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Player Detail Dialog */}
      {selectedPlayer && (
        <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <PlayerDetailCard 
              player={selectedPlayer} 
              onClose={() => setSelectedPlayer(null)}
              extraActivities={extraActivities}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
