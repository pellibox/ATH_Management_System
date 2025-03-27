
import React from "react";
import { Player } from "@/types/player";
import { TableRow, TableCell } from "@/components/ui/table";
import { PlayerAvatar } from "./PlayerAvatar";
import { ProgramBadge } from "./ProgramBadge";
import { PlayerActionMenu } from "./PlayerActionMenu";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { getProgramColor } from "../utils/programUtils";

interface PlayerRowProps {
  player: Player;
  onEdit?: (player: Player) => void;
  onDelete?: (id: string) => void;
  onMessage?: (player: Player) => void;
  onViewDetails?: (player: Player) => void;
  onRegisterActivity?: (playerId: string) => void;
  onChangeProgram?: (player: Player, program: string) => void;
  availablePrograms?: string[];
}

export function PlayerRow({ 
  player,
  onEdit,
  onDelete,
  onMessage,
  onViewDetails,
  onRegisterActivity,
  onChangeProgram,
  availablePrograms = []
}: PlayerRowProps) {
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

  // Get program color for the border
  const programColor = player.program ? getProgramColor(player.program) : "#e0e0e0";

  // Default empty function if onViewDetails is not provided
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(player);
    }
  };

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
        {onChangeProgram ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-1">
                <ProgramBadge program={player.program} />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 bg-white">
              <DropdownMenuItem 
                onClick={() => onChangeProgram(player, '')}
                className={!player.program ? "bg-gray-100" : ""}
              >
                Non assegnato
              </DropdownMenuItem>
              {availablePrograms.map(program => (
                <DropdownMenuItem 
                  key={program}
                  onClick={() => onChangeProgram(player, program)}
                  className={player.program === program ? "bg-gray-100" : ""}
                >
                  {program}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <ProgramBadge program={player.program} />
        )}
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
          onDelete={onDelete ? () => onDelete(player.id) : undefined}
          onEdit={onEdit ? () => onEdit(player) : undefined}
          onMessage={onMessage ? () => onMessage(player) : undefined}
          onRegisterActivity={onRegisterActivity ? () => onRegisterActivity(player.id) : undefined}
          onViewDetails={handleViewDetails}
        />
      </TableCell>
    </TableRow>
  );
}
