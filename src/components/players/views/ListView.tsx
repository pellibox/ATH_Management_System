
import React from "react";
import { Player } from "@/types/player";
import { MoreVertical, Edit, Trash2, Calendar, ClipboardList } from "lucide-react";
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
import { ScheduleButton } from "../ScheduleMessage";
import { ActivityRegistration } from "../ActivityRegistration";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router-dom";
import { getProgramColor } from "../utils/programUtils";

interface ListViewProps {
  players: Player[];
}

export function ListView({ players }: ListViewProps) {
  const { setEditingPlayer, handleDeletePlayer, setMessagePlayer } = usePlayerContext();
  const navigate = useNavigate();
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-gray-100 text-gray-700";
      case "Intermediate": return "bg-blue-100 text-blue-700";
      case "Advanced": return "bg-green-100 text-green-700";
      case "Professional": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Livello</TableHead>
            <TableHead>Coach</TableHead>
            <TableHead>Programma</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.length > 0 ? (
            players.map((player) => {
              // Get program color for the row border
              const programColor = player.program ? getProgramColor(player.program) : "#e0e0e0";
              
              return (
                <TableRow 
                  key={player.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  style={{ 
                    borderLeftWidth: '4px',
                    borderLeftColor: programColor
                  }}
                >
                  <TableCell 
                    className="font-medium"
                    onClick={() => navigate(`/players/details?id=${player.id}`)}
                  >
                    {player.name}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(player.level)}`}>
                      {player.level}
                    </span>
                  </TableCell>
                  <TableCell>{player.coach}</TableCell>
                  <TableCell>
                    {player.program && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {player.program}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {player.sports && (
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(player.sports) ? (
                          player.sports.map((sport, index) => (
                            <span key={index} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                              {sport}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                            {player.sports}
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{player.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <ActivityRegistration playerId={player.id} playerName={player.name} />
                      <ScheduleButton onClick={() => setMessagePlayer(player)} />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/court-vision?playerId=${player.id}`)}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>

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
                              Modifica
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem onClick={() => navigate(`/players/objectives?id=${player.id}`)}>
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Obiettivi
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeletePlayer(player.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Elimina
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Nessun giocatore trovato con questi criteri di ricerca
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
