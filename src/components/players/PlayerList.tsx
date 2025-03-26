
import { useState } from "react";
import { Player } from "@/types/player";
import { MoreVertical, Edit, Trash2, UserPlus, Mail, Phone, CalendarClock } from "lucide-react";
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
import { PlayerDetailCard } from "./PlayerDetailCard";

export function PlayerList() {
  const { 
    filteredPlayers,
    setEditingPlayer, 
    handleDeletePlayer,
    setMessagePlayer,
    extraActivities
  } = usePlayerContext();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Coach</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <TableRow 
                key={player.id} 
                className="cursor-pointer hover:bg-gray-50" 
                onClick={() => setSelectedPlayer(player)}
              >
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    player.level === "Beginner" ? "bg-gray-100 text-gray-700" :
                    player.level === "Intermediate" ? "bg-blue-100 text-blue-700" :
                    player.level === "Advanced" ? "bg-green-100 text-green-700" :
                    "bg-purple-100 text-purple-700"
                  }`}>
                    {player.level}
                  </span>
                </TableCell>
                <TableCell>{player.coach}</TableCell>
                <TableCell>{player.email}</TableCell>
                <TableCell>{player.phone}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <ActivityRegistration playerId={player.id} playerName={player.name} />
                    <ScheduleButton onClick={(e) => {
                      e.stopPropagation();
                      setMessagePlayer(player);
                    }} />

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
                              Edit
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
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No players found matching your search criteria
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
