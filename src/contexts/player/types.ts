
import React from "react";
import { Player } from "@/types/player/interfaces";
import { ExtraActivity } from "@/types/extra-activities";

export interface PlayerContextType {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  filteredPlayers: Player[];
  filterTerm: string;
  setFilterTerm: (term: string) => void;
  filterProgram: string;
  setFilterProgram: (program: string) => void;
  filterStatus: 'all' | 'active' | 'inactive';
  setFilterStatus: (status: 'all' | 'active' | 'inactive') => void;
  editingPlayer: Player | null;
  setEditingPlayer: (player: Player | null) => void;
  messagePlayer: Player | null;
  setMessagePlayer: (player: Player | null) => void;
  messageContent: string;
  setMessageContent: (content: string) => void;
  selectedActivities: string[];
  setSelectedActivities: (activities: string[]) => void;
  extraActivities: ExtraActivity[];
  availablePrograms: string[];
  
  // Search and filter properties needed by components
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  programFilter: string;
  setProgramFilter: (program: string) => void;
  resetFilters: () => void;
  scheduleType: "day" | "week" | "month";
  setScheduleType: (type: "day" | "week" | "month") => void;
  newPlayer: Player;
  setNewPlayer: (player: Player) => void;
  
  // Action methods
  handleAddPlayer: (player: Player) => void;
  handleUpdatePlayer: (player: Player) => void;
  handleDeletePlayer: (id: string) => void;
  handleSendMessage: () => void;
  handleRegisterActivity: (player: Player, activityIds: string[]) => void;
  handleRegisterForActivities: (playerId: string) => void;
  handleSetObjectives: (playerId: string, objectives: any) => void;
}

export interface PlayerProviderProps {
  children: React.ReactNode;
}
