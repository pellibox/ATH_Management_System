
import React, { createContext, useContext, useState } from "react";
import { PlayerContextType } from "./types";
import { Player, mockPlayers } from "@/types/player";
import { defaultObjectives, defaultNewPlayer, mockExtraActivities } from "./initialState";
import { usePlayerActions } from "./playerActions";

// Create the context
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Create provider component
export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState(mockPlayers);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [coachFilter, setCoachFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [messagePlayer, setMessagePlayer] = useState<Player | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("week");
  const [objectives, setObjectives] = useState(defaultObjectives);
  const [extraActivities, setExtraActivities] = useState(mockExtraActivities);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState(defaultNewPlayer);

  // Get unique coaches for filter dropdown
  const coaches: string[] = Array.from(
    new Set(players.filter(player => player.coach).map(player => player.coach as string))
  );

  // Filter players based on search and filters
  const filteredPlayers = players.filter(player => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Level filter
    const matchesLevel = levelFilter === "all" || player.level === levelFilter;
    
    // Coach filter
    const matchesCoach = coachFilter === "all" || player.coach === coachFilter;
    
    // Program filter
    const matchesProgram = programFilter === "all" || player.programId === programFilter;
    
    return matchesSearch && matchesLevel && matchesCoach && matchesProgram;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setLevelFilter("all");
    setCoachFilter("all");
    setProgramFilter("all");
  };

  // Use the player actions
  const playerActions = usePlayerActions({
    players,
    setPlayers,
    editingPlayer,
    setEditingPlayer,
    messagePlayer,
    setMessagePlayer,
    messageContent,
    setMessageContent,
    extraActivities,
    setExtraActivities,
    selectedActivities,
    setSelectedActivities,
    setObjectives
  });

  // Context value
  const contextValue: PlayerContextType = {
    // State
    players,
    searchQuery,
    levelFilter,
    coachFilter,
    programFilter,
    editingPlayer,
    messagePlayer,
    messageContent,
    scheduleType,
    objectives,
    newPlayer,
    coaches,
    filteredPlayers,
    extraActivities,
    selectedActivities,

    // State setters
    setSearchQuery,
    setLevelFilter,
    setCoachFilter,
    setProgramFilter,
    setEditingPlayer,
    setMessagePlayer,
    setMessageContent,
    setScheduleType,
    setObjectives,
    setNewPlayer,
    setSelectedActivities,
    resetFilters,
    
    // Actions
    ...playerActions
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook to use the player context
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};
