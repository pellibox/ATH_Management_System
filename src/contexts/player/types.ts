
import { Player } from "@/types/player";
import { ExtraActivity } from "@/types/extra-activities";

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
  objectives: Record<string, any>;
  newPlayer: Player;
  coaches: string[];
  filteredPlayers: Player[];
  extraActivities: ExtraActivity[];
  selectedActivities: string[];
  
  // State setters
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setSearchQuery: (query: string) => void;
  setLevelFilter: (filter: string) => void;
  setCoachFilter: (filter: string) => void;
  setProgramFilter: (filter: string) => void;
  setEditingPlayer: (player: Player | null) => void;
  setMessagePlayer: (player: Player | null) => void;
  setMessageContent: (content: string) => void;
  setScheduleType: (type: "day" | "week" | "month") => void;
  setObjectives: (objectives: Record<string, any>) => void;
  setNewPlayer: (player: Player) => void;
  setSelectedActivities: (activities: string[]) => void;
  resetFilters: () => void;
  
  // Actions
  handleAddPlayer: (player: Omit<Player, "id">) => void;
  handleUpdatePlayer: (updatedPlayer: Player) => void; // Updated to accept a Player parameter
  handleDeletePlayer: (id: string, name: string) => void;
  handleSendMessage: () => void;
  handleScheduleActivity: (
    playerId: string,
    activityIds: string[]
  ) => void;
  handlePlayerObjectiveChange: (
    objectiveKey: string,
    value: any
  ) => void;
  
  // Add the missing methods
  handleSetObjectives: (objectives: Player["objectives"]) => void;
  handleRegisterForActivities: (playerId: string) => void;
  handleEditPlayerObjectives: (player: Player) => void;
}
