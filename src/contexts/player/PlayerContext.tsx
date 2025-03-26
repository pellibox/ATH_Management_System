import React, { createContext, useContext, useState } from "react";
import { PlayerContextType } from "./types";
import { Player, mockPlayers } from "@/types/player";
import { defaultObjectives, defaultNewPlayer, mockExtraActivities } from "./initialState";
import { usePlayerActions } from "./actions";

// Add the missing interface
interface PlayerProviderProps {
  children: React.ReactNode;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
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
  
  const [newPlayer, setNewPlayer] = useState<Player>({
    ...defaultNewPlayer,
    id: "new-temp-id"
  });

  const coaches: string[] = Array.from(
    new Set(players.filter(player => player.coach).map(player => player.coach as string))
  );

  const filteredPlayers = players.filter(player => {
    const matchesSearch = searchQuery === "" || 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = levelFilter === "all"  || player.level === levelFilter;
    
    const matchesCoach = coachFilter === "all" || player.coach === coachFilter;
    
    const matchesProgram = programFilter === "all" || player.program === programFilter;
    
    return matchesSearch && matchesLevel && matchesCoach && matchesProgram;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setLevelFilter("all");
    setCoachFilter("all");
    setProgramFilter("all");
  };

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

  // Fix the handleDeletePlayer function to match expected signature
  const handleDeletePlayer = (id: string) => {
    const player = players.find(p => p.id === id);
    if (player) {
      playerActions.handleDeletePlayer(id);
    }
  };

  // Fix the handleEditPlayer function to match expected signature
  const handleEditPlayer = (id: string) => {
    const player = players.find(p => p.id === id);
    if (player) {
      setEditingPlayer(player);
    }
  };

  // Fix the handleSetObjectives function to match expected signature
  const handleSetObjectives = (playerID: string, objectives: any) => {
    console.log("Setting objectives for player", playerID, objectives);
    const updatedPlayers = players.map(player => 
      player.id === playerID 
        ? { ...player, objectives: objectives } 
        : player
    );
    setPlayers(updatedPlayers);
  };

  // This stays unchanged
  const handleRegisterForActivities = (playerId: string, name: string) => {
    console.log("Registering player for activities", playerId, name);
    playerActions.handleRegisterForActivities(playerId);
  };

  const contextValue: PlayerContextType = {
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

    setPlayers,
    setSearchQuery,
    setLevelFilter,
    setCoachFilter,
    setProgramFilter,
    setEditingPlayer,
    setMessagePlayer,
    setMessageContent,
    setScheduleType,
    setObjectives,
    setNewPlayer: (player: Player) => setNewPlayer({ 
      ...player, 
      id: player.id || "new-temp-id"
    }),
    setSelectedActivities,
    resetFilters,
    handleDeletePlayer,
    handleEditPlayer,
    handleSetObjectives,
    handleRegisterActivity: playerActions.handleRegisterActivity,
    handleRegisterForActivities,
    ...playerActions
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};
