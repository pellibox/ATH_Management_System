
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
  handleAddPlayer: (player: Player) => void;
  handleUpdatePlayer: (player: Player) => void;
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
}
