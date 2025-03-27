import React from "react";
import { Player } from "@/types/player/interfaces";

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
  extraActivities: Record<string, any[]>;
  availablePrograms: string[];  // Add this property
  
  // Action methods
  handleAddPlayer: (player: Player) => void;
  handleUpdatePlayer: (player: Player) => void;
  handleDeletePlayer: (id: string) => void;
  handleSendMessage: (type: 'WhatsApp' | 'Email' | 'SMS') => void;
  handleRecordActivity: (playerId: string, activity: string) => void;
  handleUpdateObjectives: (playerId: string, objectives: Player['objectives']) => void;
}

export interface PlayerProviderProps {
  children: React.ReactNode;
}
