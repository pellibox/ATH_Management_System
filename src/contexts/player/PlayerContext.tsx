
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Player } from "@/types/player";
import { ExtraActivity } from "@/types/extra-activities";
import { useToast } from "@/hooks/use-toast";
import { EXCLUDED_PROGRAM_NAMES } from "@/contexts/programs/useProgramsState";

// Helper function to generate IDs since we don't have it in utils
const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

// Helper function to get available players as replacement for the missing import
const getAvailablePlayers = (): Player[] => {
  return [
    {
      id: "player1",
      name: "Marco Rossi",
      email: "marco.rossi@example.com",
      phone: "123-456-7890",
      level: "Advanced",
      status: "active",
      program: "Future Champions"
    },
    {
      id: "player2",
      name: "Giulia Bianchi",
      email: "giulia.bianchi@example.com",
      phone: "098-765-4321",
      level: "Intermediate",
      status: "active",
      program: "Performance"
    },
    {
      id: "player3",
      name: "Lorenzo Verdi",
      email: "lorenzo.verdi@example.com",
      phone: "555-123-4567",
      level: "Beginner",
      status: "inactive",
      coach: "Andrea Neri"
    }
  ];
};

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
  // Add missing properties for ActivityRegistration
  extraActivities: ExtraActivity[];
  selectedActivities: string[];
  setSelectedActivities: (activities: string[]) => void;
  handleRegisterForActivities: (playerId: string) => void;
  // Add missing properties for PlayerObjectives
  handleSetObjectives: (playerId: string, objectives: any) => void;
  // Add missing properties for ScheduleMessage
  messageContent: string;
  setMessageContent: (content: string) => void;
  scheduleType: "day" | "week" | "month";
  setScheduleType: (type: "day" | "week" | "month") => void;
  handleSendMessage: () => void;
  // Add missing property for PlayerDetailCard
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
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
  
  // Add missing state variables
  const [extraActivities, setExtraActivities] = useState<ExtraActivity[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState<string>("");
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("week");
  
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
  
  // Add missing handler functions
  const handleRegisterForActivities = useCallback((playerId: string) => {
    if (selectedActivities.length === 0) {
      toast({
        title: "Nessuna attività selezionata",
        description: "Seleziona almeno un'attività per registrare il giocatore.",
        variant: "destructive",
      });
      return;
    }

    // Update activities with player registration
    setExtraActivities(prev => 
      prev.map(activity => {
        if (selectedActivities.includes(activity.id)) {
          return {
            ...activity,
            participants: activity.participants.includes(playerId) 
              ? activity.participants 
              : [...activity.participants, playerId]
          };
        }
        return activity;
      })
    );

    const playerName = players.find(p => p.id === playerId)?.name || "Giocatore";
    
    toast({
      title: "Registrazione completata",
      description: `${playerName} è stato registrato per ${selectedActivities.length} attività.`,
    });
    
    setSelectedActivities([]);
  }, [selectedActivities, players, toast]);

  const handleSetObjectives = useCallback((playerId: string, objectives: any) => {
    setPlayers(prev => 
      prev.map(player => {
        if (player.id === playerId) {
          return {
            ...player,
            objectives
          };
        }
        return player;
      })
    );
    
    const playerName = players.find(p => p.id === playerId)?.name || "Giocatore";
    
    toast({
      title: "Obiettivi impostati",
      description: `Gli obiettivi per ${playerName} sono stati aggiornati.`,
    });
    
    setEditingPlayer(null);
  }, [players, toast]);

  const handleSendMessage = useCallback(() => {
    if (!messagePlayer) return;
    
    toast({
      title: `Messaggio inviato via ${messagePlayer.preferredContactMethod || "WhatsApp"}`,
      description: `Il programma è stato inviato a ${messagePlayer.name}.`,
    });
    
    setMessagePlayer(null);
    setMessageContent("");
  }, [messagePlayer, toast]);
  
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
      // Add missing properties for components
      extraActivities,
      selectedActivities,
      setSelectedActivities,
      handleRegisterForActivities,
      handleSetObjectives,
      messageContent,
      setMessageContent,
      scheduleType,
      setScheduleType,
      handleSendMessage,
      setPlayers,
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
