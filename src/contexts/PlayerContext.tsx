
import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Player, mockPlayers } from "@/types/player";

// Define the context shape
interface PlayerContextType {
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

  // Actions
  setSearchQuery: (query: string) => void;
  setLevelFilter: (filter: string) => void;
  setCoachFilter: (filter: string) => void;
  setEditingPlayer: (player: Player | null) => void;
  setMessagePlayer: (player: Player | null) => void;
  setMessageContent: (content: string) => void;
  setScheduleType: (type: "day" | "week" | "month") => void;
  setObjectives: (objectives: Record<string, string>) => void;
  setNewPlayer: (player: Omit<Player, "id">) => void;
  resetFilters: () => void;
  handleAddPlayer: (playerData: Omit<Player, "id">) => void;
  handleUpdatePlayer: () => void;
  handleDeletePlayer: (id: string, name: string) => void;
  handleSendMessage: () => void;
  handleSetObjectives: (objectives: Player["objectives"]) => void;
  handleEditPlayerObjectives: (player: Player) => void;
}

// Create the context
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Create provider component
export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [coachFilter, setCoachFilter] = useState<string>("all");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [messagePlayer, setMessagePlayer] = useState<Player | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("week");
  const [objectives, setObjectives] = useState({
    daily: "",
    weekly: "",
    monthly: "",
    seasonal: ""
  });
  const [newPlayer, setNewPlayer] = useState<Omit<Player, "id">>({
    name: "",
    age: 0,
    gender: "Male",
    level: "Beginner",
    coach: "",
    phone: "",
    email: "",
    joinDate: new Date().toISOString().split("T")[0],
    notes: "",
    preferredContactMethod: "WhatsApp",
    objectives: {
      daily: "",
      weekly: "",
      monthly: "",
      seasonal: ""
    }
  });

  // Get unique coaches for filter dropdown
  const coaches = Array.from(new Set(players.map(player => player.coach)));

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
    
    return matchesSearch && matchesLevel && matchesCoach;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setLevelFilter("all");
    setCoachFilter("all");
  };

  // Handle adding a new player
  const handleAddPlayer = (playerData: Omit<Player, "id">) => {
    const newId = `p${Date.now()}`;
    
    setPlayers([
      ...players,
      { id: newId, ...playerData }
    ]);
    
    toast({
      title: "Player Added",
      description: `${playerData.name} has been added to the database.`,
    });
  };

  // Handle updating a player
  const handleUpdatePlayer = () => {
    if (!editingPlayer) return;
    
    setPlayers(players.map(player => 
      player.id === editingPlayer.id ? editingPlayer : player
    ));
    
    setEditingPlayer(null);
    
    toast({
      title: "Player Updated",
      description: `${editingPlayer.name}'s information has been updated.`,
    });
  };

  // Handle deleting a player
  const handleDeletePlayer = (id: string, name: string) => {
    setPlayers(players.filter(player => player.id !== id));
    
    toast({
      title: "Player Deleted",
      description: `${name} has been removed from the database.`,
      variant: "destructive",
    });
  };

  // Handle sending a message or schedule
  const handleSendMessage = () => {
    if (!messagePlayer) return;
    
    const method = messagePlayer.preferredContactMethod || "WhatsApp";
    
    toast({
      title: `Message Sent via ${method}`,
      description: `Your ${scheduleType}ly schedule has been sent to ${messagePlayer.name}.`,
    });
    
    setMessagePlayer(null);
    setMessageContent("");
  };

  // Handle setting player objectives
  const handleSetObjectives = (updatedObjectives: Player["objectives"]) => {
    if (!editingPlayer) return;
    
    const updatedPlayer = {
      ...editingPlayer,
      objectives: updatedObjectives
    };
    
    setPlayers(players.map(player => 
      player.id === updatedPlayer.id ? updatedPlayer : player
    ));
    
    setEditingPlayer(null);
    
    toast({
      title: "Objectives Set",
      description: `Training objectives for ${updatedPlayer.name} have been updated.`,
    });
  };

  // Set up an editing player for objectives tab
  const handleEditPlayerObjectives = (player: Player) => {
    setEditingPlayer(player);
    setObjectives(player.objectives || {
      daily: "",
      weekly: "",
      monthly: "",
      seasonal: ""
    });
  };

  // Context value
  const contextValue: PlayerContextType = {
    players,
    searchQuery,
    levelFilter,
    coachFilter,
    editingPlayer,
    messagePlayer,
    messageContent,
    scheduleType,
    objectives,
    newPlayer,
    coaches,
    filteredPlayers,
    setSearchQuery,
    setLevelFilter,
    setCoachFilter,
    setEditingPlayer,
    setMessagePlayer,
    setMessageContent,
    setScheduleType,
    setObjectives,
    setNewPlayer,
    resetFilters,
    handleAddPlayer,
    handleUpdatePlayer,
    handleDeletePlayer,
    handleSendMessage,
    handleSetObjectives,
    handleEditPlayerObjectives,
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
