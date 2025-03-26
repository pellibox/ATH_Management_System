
import { Player } from "@/types/player";
import { ExtraActivity } from "@/types/extra-activities";

// Define the context shape
export interface PlayerContextType {
  // State
  players: Player[];
  searchQuery: string;
  levelFilter: string;
  coachFilter: string;
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
  newPlayer: Omit<Player, "id">;
  coaches: string[];
  filteredPlayers: Player[];
  extraActivities: ExtraActivity[];
  selectedActivities: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setLevelFilter: (filter: string) => void;
  setCoachFilter: (filter: string) => void;
  setEditingPlayer: (player: Player | null) => void;
  setMessagePlayer: (player: Player | null) => void;
  setMessageContent: (content: string) => void;
  setScheduleType: (type: "day" | "week" | "month") => void;
  setObjectives: (objectives: {
    daily: string;
    weekly: string;
    monthly: string;
    seasonal: string;
  }) => void;
  setNewPlayer: (player: Omit<Player, "id">) => void;
  setSelectedActivities: (activityIds: string[]) => void;
  resetFilters: () => void;
  
  // Add the missing action methods referenced in Pages.tsx
  handleAddPlayer: (playerData: Omit<Player, "id">) => void;
  handleUpdatePlayer: () => void;
  handleDeletePlayer: (id: string, name: string) => void;
  handleSendMessage: () => void;
  handleSetObjectives: (objectives: Player["objectives"]) => void;
  handleEditPlayerObjectives: (player: Player) => void;
  handleRegisterForActivities: (playerId: string) => void;
}
