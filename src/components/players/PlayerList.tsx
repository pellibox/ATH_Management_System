import { useState } from "react";
import { Player } from "@/types/player";
import { MoreVertical, Edit, Trash2, Mail, SortAsc, SortDesc, Clock, CalendarPlus } from "lucide-react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScheduleButton } from "./ScheduleMessage";
import { ActivityRegistration } from "./ActivityRegistration";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { PlayerDetailCard } from "./detail";
import { DEFAULT_PROGRAMS } from "@/components/court-vision/constants";

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

  const getProgramColor = (program: string | undefined) => {
    if (!program) return "#e0e0e0"; // Default gray
    
    const foundProgram = DEFAULT_PROGRAMS.find(p => p.name === program || p.id === program);
    if (foundProgram) {
      return foundProgram.color;
    }
    
    const hash = program.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8B5CF6", "#EC4899"];
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
            sortedPlayers.map((player) => {
              const programColor = getProgramColor(player.program);
              
              return (
                <TableRow 
                  key={player.id} 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => setSelectedPlayer(player)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div 
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white mr-2"
                        style={{ backgroundColor: programColor }}
                      >
                        {player.name.substring(0, 1).toUpperCase()}
                      </div>
                      {player.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {player.program ? (
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${programColor}20`, 
                          color: programColor,
                          border: `1px solid ${programColor}40`
                        }}
                      >
                        {player.program}
                      </span>
                    ) : (
                      <span className="text-gray-500">Non assegnato</span>
                    )}
                  </TableCell>
                  <TableCell>{player.email}</TableCell>
                  <TableCell>{player.phone}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white z-50">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlayer(player);
                        }}>
                          <div className="flex items-center w-full">
                            <div className="h-4 w-4 mr-2">👁️</div>
                            Visualizza dettagli
                          </div>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setMessagePlayer(player);
                        }}>
                          <Mail className="h-4 w-4 mr-2" />
                          Invia messaggio
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          const dialogTrigger = document.querySelector(`[data-player-id="${player.id}"]`);
                          if (dialogTrigger instanceof HTMLElement) {
                            dialogTrigger.click();
                          }
                        }}>
                          <CalendarPlus className="h-4 w-4 mr-2" />
                          Registra attività
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setEditingPlayer(player);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifica
                        </DropdownMenuItem>
                        
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
                    
                    <div className="hidden">
                      <ActivityRegistration playerId={player.id} playerName={player.name} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Nessun giocatore trovato con i criteri di ricerca specificati
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedPlayer && (
        <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
          <DialogContent className="sm:max-w-[800px] bg-white">
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
