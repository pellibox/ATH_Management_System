
import React from "react";
import { Player } from "@/types/player";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { PlayerRow } from "../components/PlayerRow";

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
            <TableHead>Programma</TableHead>
            <TableHead>Livello</TableHead>
            <TableHead>Coach</TableHead>
            <TableHead>Status</TableHead>
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
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Nessun giocatore trovato con questi criteri di ricerca
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
