
import { Player } from "@/types/player";
import { Edit, Trash2, Mail, MoreVertical, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface PlayerActionMenuProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (id: string, name: string) => void;
  onMessage: (player: Player) => void;
  onViewDetails: (player: Player) => void;
  onRegisterActivity: (playerId: string) => void;
}

export function PlayerActionMenu({
  player,
  onEdit,
  onDelete,
  onMessage,
  onViewDetails,
  onRegisterActivity
}: PlayerActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white z-50">
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          onViewDetails(player);
        }}>
          <div className="flex items-center w-full">
            <div className="h-4 w-4 mr-2">👁️</div>
            Visualizza dettagli
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          onMessage(player);
        }}>
          <Mail className="h-4 w-4 mr-2" />
          Invia messaggio
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          onRegisterActivity(player.id);
        }}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Registra attività
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          onEdit(player);
        }}>
          <Edit className="h-4 w-4 mr-2" />
          Modifica
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(player.id, player.name);
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Elimina
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
