
import React, { createContext, useContext, useState } from "react";
import { PlayerContextType, PlayerProviderProps } from "./types";
import { Player } from "@/types/player";
import { defaultObjectives, defaultNewPlayer, mockExtraActivities } from "./initialState";
import { usePlayerActions } from "./actions";
import { ExtraActivity } from "@/types/extra-activities";

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [coachFilter, setCoachFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [messagePlayer, setMessagePlayer] = useState<Player | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("week");
  const [objectives, setObjectives] = useState(defaultObjectives);
  const [extraActivities, setExtraActivities] = useState<ExtraActivity[]>(mockExtraActivities);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState<Player>({
    ...defaultNewPlayer,
    id: "new-temp-id"
  });

  const [filterTerm, setFilterTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const coaches: string[] = Array.from(
    new Set(players.filter(player => player.coach).map(player => player.coach as string))
  );

  const filteredPlayers = players.filter(player => {
    const matchesSearch = searchQuery === "" || 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = levelFilter === "all" || player.level === levelFilter;
    
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

  const handleDeletePlayer = (id: string) => {
    const player = players.find(p => p.id === id);
    if (player) {
      playerActions.handleDeletePlayer(id);
    }
  };

  const handleEditPlayer = (id: string) => {
    const player = players.find(p => p.id === id);
    if (player) {
      setEditingPlayer(player);
    }
  };

  const handleSetObjectives = (playerID: string, updatedObjectives: any) => {
    console.log("Setting objectives for player", playerID, updatedObjectives);
    const updatedPlayers = players.map(player => 
      player.id === playerID 
        ? { ...player, objectives: updatedObjectives } 
        : player
    );
    setPlayers(updatedPlayers);
  };

  const handleRegisterForActivities = (playerId: string) => {
    console.log("Registering player for activities", playerId);
    // Logic for registering a player for activities
    const player = players.find(p => p.id === playerId);
    if (player && selectedActivities.length > 0) {
      // Implementation would go here
    }
  };

  const [availablePrograms, setAvailablePrograms] = useState<string[]>([
    "Beginner", "Intermediate", "Advanced", "Professional",
    "Junior", "Elite", "Academy", "Competition", "Recreational"
  ]);

  const contextValue: PlayerContextType = {
    players,
    setPlayers,
    filteredPlayers,
    searchQuery,
    setSearchQuery,
    programFilter,
    setProgramFilter,
    resetFilters,
    scheduleType,
    setScheduleType,
    newPlayer,
    setNewPlayer,
    
    filterTerm,
    setFilterTerm,
    filterProgram,
    setFilterProgram,
    filterStatus,
    setFilterStatus,
    editingPlayer,
    messagePlayer,
    messageContent,
    selectedActivities,
    extraActivities,
    availablePrograms,
    setEditingPlayer,
    setMessagePlayer,
    setMessageContent,
    setSelectedActivities,
    
    handleAddPlayer: playerActions.handleAddPlayer,
    handleUpdatePlayer: playerActions.handleUpdatePlayer,
    handleDeletePlayer,
    handleSendMessage: () => {
      if (messagePlayer) {
        const contactMethod = messagePlayer.preferredContactMethod || "WhatsApp";
        playerActions.handleSendMessage(contactMethod);
      }
    },
    handleRegisterActivity: (player: Player, activityIds: string[]) => {
      console.log("Registering activities for player", player.id, activityIds);
      // Implementation would go here
    },
    handleRegisterForActivities,
    handleSetObjectives
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
