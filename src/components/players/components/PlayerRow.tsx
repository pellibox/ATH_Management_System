
import React from "react";
import { Player } from "@/types/player";
import { TableRow, TableCell } from "@/components/ui/table";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { PlayerAvatar } from "./PlayerAvatar";
import { ProgramBadge } from "./ProgramBadge";
import { PlayerActionMenu } from "./PlayerActionMenu";
import { DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { getProgramColor } from "../utils/programUtils";

interface PlayerRowProps {
  player: Player;
  onEdit?: (player: Player) => void;
  onDelete?: (id: string) => void;
  onMessage?: (player: Player) => void;
  onViewDetails?: (player: Player) => void;
  onRegisterActivity?: (playerId: string) => void;
}

export function PlayerRow({ 
  player,
  onEdit,
  onDelete,
  onMessage,
  onViewDetails,
  onRegisterActivity
}: PlayerRowProps) {
  const { 
    handleDeletePlayer, 
    setEditingPlayer, 
    setMessagePlayer, 
    setMessageContent, 
    setSelectedActivities 
  } = usePlayerContext();

  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Use passed callback functions if provided, otherwise use context functions
  const handleEdit = onEdit || setEditingPlayer;
  // Fixed handleDelete to not pass name parameter
  const handleDelete = onDelete || ((id: string) => handleDeletePlayer(id));
  const handleMessage = onMessage || ((player: Player) => {
    setMessagePlayer(player);
    setMessageContent("");
  });
  const handleViewDetails = onViewDetails || (() => {});
  const handleRegisterActivity = onRegisterActivity || (() => {
    setEditingPlayer(player);
    setSelectedActivities([]);
  });

  // Get program color for the border
  const programColor = player.program ? getProgramColor(player.program) : "#e0e0e0";

  return (
    <TableRow 
      key={player.id} 
      className="border-b hover:bg-gray-50"
      style={{ 
        borderLeftWidth: '4px',
        borderLeftColor: programColor
      }}
    >
      <TableCell className="py-3">
        <div className="flex items-center">
          <PlayerAvatar name={player.name} program={player.program} />
          <div>
            <p className="font-medium">{player.name}</p>
            <p className="text-xs text-gray-500">{player.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <ProgramBadge program={player.program} />
      </TableCell>
      <TableCell>
        <span className="text-sm">{player.level}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{player.coach || "Non assegnato"}</span>
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusClass(player.status)}`}>
          {player.status === "active" ? "Attivo" : "Inattivo"}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <PlayerActionMenu 
          player={player}
          onDelete={() => handleDelete(player.id)}
          onEdit={() => handleEdit(player)}
          onMessage={() => handleMessage(player)}
          onRegisterActivity={() => handleRegisterActivity(player.id)}
          onViewDetails={() => handleViewDetails(player)}
        />
      </TableCell>
    </TableRow>
  );
}
