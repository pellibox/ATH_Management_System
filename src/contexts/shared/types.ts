
import { PersonData } from "@/components/court-vision/types";
import { Player } from "@/types/player";

// Interface for the shared player context
export interface SharedPlayerContextType {
  sharedPlayers: PersonData[];
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (id: string) => void;
  getPlayerById: (id: string) => PersonData | undefined;
  syncHours: (id: string, completedHours: number, missedHours: number) => void;
  updateSharedPlayerList: () => void;
}
