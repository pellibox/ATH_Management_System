
import { Player } from "@/types/player";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
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
import { DialogTrigger } from "@/components/ui/dialog";
import { ScheduleButton } from "./ScheduleMessage";
import { ActivityRegistration } from "./ActivityRegistration";
import { usePlayerContext } from "@/contexts/PlayerContext";

export function PlayerList() {
  const { 
    filteredPlayers,
    setEditingPlayer, 
    handleDeletePlayer,
    setMessagePlayer
  } = usePlayerContext();

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
              <TableRow key={player.id}>
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
                    <ScheduleButton onClick={() => setMessagePlayer(player)} />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DialogTrigger asChild onClick={() => setEditingPlayer(player)}>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeletePlayer(player.id, player.name)}
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
    </div>
  );
}
