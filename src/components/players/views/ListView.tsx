
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
import PlayerRow from "../../players/PlayerRow";

interface ListViewProps {
  players: Player[];
}

export function ListView({ players }: ListViewProps) {
  const { 
    setEditingPlayer, 
    handleDeletePlayer, 
    setMessagePlayer,
    handleUpdatePlayer,
    availablePrograms = [] 
  } = usePlayerContext();
  const navigate = useNavigate();
  
  const handleChangeProgram = (player: Player, program: string) => {
    const updatedPlayer = { 
      ...player, 
      program: program || undefined,
      programs: program ? [program] : []
    };
    handleUpdatePlayer(updatedPlayer);
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Livello</TableHead>
            <TableHead>Programma</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Data Iscrizione</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.length > 0 ? (
            players.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                onEdit={setEditingPlayer}
                onDelete={handleDeletePlayer}
                onMessage={setMessagePlayer}
                onChangeProgram={handleChangeProgram}
                availablePrograms={availablePrograms}
              />
            ))
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
