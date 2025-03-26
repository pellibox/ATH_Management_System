
import React from "react";
import { Player } from "@/types/player";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { DialogTrigger } from "@/components/ui/dialog";
import { ScheduleButton } from "../ScheduleMessage";
import { ActivityRegistration } from "../ActivityRegistration";
import { Calendar, Edit, Trash2, MoreVertical, ClipboardList, User, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProgramColor } from "../utils/programUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GridViewProps {
  players: Player[];
}

export function GridView({ players }: GridViewProps) {
  const { setEditingPlayer, handleDeletePlayer, setMessagePlayer } = usePlayerContext();
  const navigate = useNavigate();
  
  const getRandomColor = (id: string) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-yellow-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {players.length > 0 ? (
        players.map((player) => {
          // Get program color for the card border
          const programColor = player.program ? getProgramColor(player.program) : "#e0e0e0";
          
          return (
            <Card 
              key={player.id} 
              className="overflow-hidden" 
              style={{ 
                borderLeftWidth: '4px',
                borderLeftColor: programColor
              }}
            >
              <div className="relative">
                <div className={`h-20 w-full ${getRandomColor(player.id)}`} />
                <div className="absolute -bottom-10 left-4">
                  {player.avatar ? (
                    <img 
                      src={player.avatar} 
                      alt={player.name}
                      className="h-20 w-20 rounded-full border-4 border-white"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/20 hover:bg-white/40">
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
                        onClick={() => handleDeletePlayer(player.id, player.name)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Elimina
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <CardContent className="pt-12 pb-4">
                <div 
                  className="text-lg font-medium truncate cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/players/details?id=${player.id}`)}
                >
                  {player.name}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(player.level)}`}>
                    {player.level}
                  </span>
                  {player.program && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {player.program}
                    </span>
                  )}
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>Coach: {player.coach}</span>
                  </div>
                  {player.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="truncate">{player.email}</span>
                    </div>
                  )}
                  {player.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{player.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 border-t px-4 py-2 flex justify-between">
                <div className="flex space-x-1">
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
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/players/details?id=${player.id}`)} 
                >
                  Dettagli
                </Button>
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
          Nessun giocatore trovato con questi criteri di ricerca
        </div>
      )}
    </div>
  );
}
