import React, { createContext, useContext, useState } from "react";
import { PlayerContextType } from "./types";
import { Player, mockPlayers } from "@/types/player";
import { defaultObjectives, defaultNewPlayer, mockExtraActivities } from "./initialState";
import { usePlayerActions } from "./actions";
import { ExtraActivity } from "@/types/extra-activities";

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

  const handleSetObjectives = (playerID: string, objectives: any) => {
    console.log("Setting objectives for player", playerID, objectives);
    const updatedPlayers = players.map(player => 
      player.id === playerID 
        ? { ...player, objectives: objectives } 
        : player
    );
    setPlayers(updatedPlayers);
  };

  const handleRegisterForActivities = (playerId: string) => {
    console.log("Registering player for activities", playerId);
    playerActions.handleRegisterForActivities(playerId);
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
    setSearchQuery: (query: string) => setSearchQuery(query),
    programFilter,
    setProgramFilter: (program: string) => setProgramFilter(program),
    resetFilters,
    scheduleType,
    setScheduleType,
    newPlayer,
    setNewPlayer: (player: Player) => setNewPlayer({ 
      ...player, 
      id: player.id || "new-temp-id"
    }),
    
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
    handleDeletePlayer,
    handleRegisterForActivities,
    handleSetObjectives,
    
    handleAddPlayer: playerActions.handleAddPlayer,
    handleUpdatePlayer: playerActions.handleUpdatePlayer,
    handleSendMessage: (playerId: string) => {
      if (messagePlayer) {
        const contactMethod = messagePlayer.preferredContactMethod || "WhatsApp";
        if (contactMethod === "WhatsApp" || contactMethod === "Email" || contactMethod === "SMS") {
          playerActions.handleSendMessage(contactMethod);
        } else {
          playerActions.handleSendMessage("WhatsApp");
        }
      }
    },
    handleRegisterActivity: playerActions.handleRegisterActivity,
    handleUpdateObjectives: playerActions.handleUpdateObjectives
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
