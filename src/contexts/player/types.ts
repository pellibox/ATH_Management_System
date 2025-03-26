
import { Player } from "@/types/player";

export interface PlayerContextType {
  // State
  players: Player[];
  searchQuery: string;
  levelFilter: string;
  coachFilter: string;
  programFilter: string;
  editingPlayer: Player | null;
  messagePlayer: Player | null;
  messageContent: string;
  scheduleType: "day" | "week" | "month";
  objectives: {
    daily: string;
    weekly: string;
    monthly: string;
    seasonal: string;
  };
  newPlayer: Player;
  coaches: string[];
  filteredPlayers: Player[];
  extraActivities: any[];
  selectedActivities: string[];

  // State setters
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setLevelFilter: React.Dispatch<React.SetStateAction<string>>;
  setCoachFilter: React.Dispatch<React.SetStateAction<string>>;
  setProgramFilter: React.Dispatch<React.SetStateAction<string>>;
  setEditingPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  setMessagePlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  setMessageContent: React.Dispatch<React.SetStateAction<string>>;
  setScheduleType: React.Dispatch<React.SetStateAction<"day" | "week" | "month">>;
  setObjectives: React.Dispatch<React.SetStateAction<{
    daily: string;
    weekly: string;
    monthly: string;
    seasonal: string;
  }>>;
  setNewPlayer: (player: Player) => void;
  setSelectedActivities: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Actions
  resetFilters: () => void;
  handleAddPlayer: (player: Player) => void;
  handleUpdatePlayer: (player: Player) => void;
  handleDeletePlayer: (id: string) => void;
  handleEditPlayer: (player: Player) => void;
  handleSendMessage: (id: string) => void;
  handleSetObjectives: (playerID: string, objectives: any) => void;
  handleRegisterActivity: (player: Player, activityIds: string[]) => void;
  handleRegisterForActivities: (playerId: string) => void;
}
