
import { Player } from "@/types/player";
import { TableCell, TableRow } from "@/components/ui/table";
import { PlayerAvatar } from "./PlayerAvatar";
import { ProgramBadge } from "./ProgramBadge";
import { PlayerActionMenu } from "./PlayerActionMenu";

interface PlayerRowProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (id: string, name: string) => void;
  onMessage: (player: Player) => void;
  onViewDetails: (player: Player) => void;
  onRegisterActivity: (playerId: string) => void;
}

export function PlayerRow({
  player,
  onEdit,
  onDelete,
  onMessage,
  onViewDetails,
  onRegisterActivity
}: PlayerRowProps) {
  return (
    <TableRow 
      key={player.id} 
      className="cursor-pointer hover:bg-gray-50" 
      onClick={() => onViewDetails(player)}
    >
      <TableCell className="font-medium">
        <div className="flex items-center">
          <PlayerAvatar name={player.name} program={player.program} />
          {player.name}
        </div>
      </TableCell>
      <TableCell>
        <ProgramBadge program={player.program} />
      </TableCell>
      <TableCell>{player.email}</TableCell>
      <TableCell>{player.phone}</TableCell>
      <TableCell className="text-right">
        <PlayerActionMenu 
          player={player}
          onEdit={onEdit}
          onDelete={onDelete}
          onMessage={onMessage}
          onViewDetails={onViewDetails}
          onRegisterActivity={onRegisterActivity}
        />
        
        <div className="hidden">
          <DialogTrigger data-player-id={player.id} />
        </div>
      </TableCell>
    </TableRow>
  );
}
