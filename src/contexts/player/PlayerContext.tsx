
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Player } from "@/types/player";
import { generateId } from "@/lib/utils";
import { getAvailablePlayers } from "./initialState";
import { useToast } from "@/hooks/use-toast";
import { EXCLUDED_PROGRAM_NAMES } from "@/contexts/programs/useProgramsState";

interface PlayerContextProps {
  players: Player[];
  filteredPlayers: Player[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  programFilter: string;
  setProgramFilter: (filter: string) => void;
  handleAddPlayer: (player: Player) => void;
  handleUpdatePlayer: (player: Player) => void;
  handleDeletePlayer: (playerId: string) => void;
  editingPlayer: Player | null;
  setEditingPlayer: (player: Player | null) => void;
  messagePlayer: Player | null;
  setMessagePlayer: (player: Player | null) => void;
  newPlayer: Player;
  availablePrograms: string[];
  setAvailablePrograms: (programs: string[]) => void;
  resetFilters: () => void;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>(getAvailablePlayers());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [messagePlayer, setMessagePlayer] = useState<Player | null>(null);
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([]);
  
  // Create a new player template
  const newPlayer: Player = {
    id: generateId(),
    name: "",
    email: "",
    phone: "",
    level: "",
    status: "active",
  };
  
  // Filter players based on search query and program filter
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        player.email.toLowerCase().includes(searchQuery.toLowerCase());
                        
    const matchesProgram = programFilter === "all" || player.program === programFilter;
    
    return matchesSearch && matchesProgram;
  });
  
  // Add a new player
  const handleAddPlayer = useCallback((player: Player) => {
    const newPlayer = {
      ...player,
      id: generateId()
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    
    toast({
      title: "Giocatore aggiunto",
      description: `${newPlayer.name} è stato aggiunto con successo.`,
    });
    
    return newPlayer;
  }, [toast]);
  
  // Update an existing player
  const handleUpdatePlayer = useCallback((updatedPlayer: Player) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );
    
    toast({
      title: "Giocatore aggiornato",
      description: `${updatedPlayer.name} è stato aggiornato con successo.`,
    });
    
    return updatedPlayer;
  }, [toast]);
  
  // Delete a player
  const handleDeletePlayer = useCallback((playerId: string) => {
    const playerToDelete = players.find(p => p.id === playerId);
    
    setPlayers(prev => prev.filter(player => player.id !== playerId));
    
    if (playerToDelete) {
      toast({
        title: "Giocatore eliminato",
        description: `${playerToDelete.name} è stato eliminato con successo.`,
      });
    }
  }, [players, toast]);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setProgramFilter("all");
  }, []);
  
  useEffect(() => {
    // Auto-update editing player when players array changes (e.g., after updates)
    if (editingPlayer) {
      const updated = players.find(p => p.id === editingPlayer.id);
      if (updated) {
        setEditingPlayer(updated);
      }
    }
  }, [players, editingPlayer]);
  
  return (
    <PlayerContext.Provider value={{
      players,
      filteredPlayers,
      searchQuery,
      setSearchQuery,
      programFilter,
      setProgramFilter,
      handleAddPlayer,
      handleUpdatePlayer,
      handleDeletePlayer,
      editingPlayer,
      setEditingPlayer,
      messagePlayer,
      setMessagePlayer,
      newPlayer,
      availablePrograms,
      setAvailablePrograms,
      resetFilters,
    }}>
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
