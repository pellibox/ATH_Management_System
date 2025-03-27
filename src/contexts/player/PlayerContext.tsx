
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player } from '@/types/player';
import { ExtraActivity } from '@/types/extra-activities';
import { PlayerContextType, PlayerProviderProps } from './types';
import { defaultNewPlayer, defaultObjectives, mockExtraActivities } from './initialState';
import { useToast } from '@/hooks/use-toast';
import { mockPlayers } from '@/types/player';

// Create context
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Custom hook for accessing the context
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};

// Provider component
export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const { toast } = useToast();

  // State
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [filterTerm, setFilterTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [messagePlayer, setMessagePlayer] = useState<Player | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [extraActivities, setExtraActivities] = useState<ExtraActivity[]>(mockExtraActivities);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  // New state properties for the enhanced capabilities
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("week");
  const [newPlayer, setNewPlayer] = useState<Player>({ ...defaultNewPlayer, id: '' } as Player);

  // Get unique programs from all players
  const availablePrograms = Array.from(
    new Set(players.filter(p => p.program).map(p => p.program))
  );

  // Filter players based on search, program, and status
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
      (player.email && player.email.toLowerCase().includes(filterTerm.toLowerCase())) ||
      (player.phone && player.phone.toLowerCase().includes(filterTerm.toLowerCase()));
    
    const matchesProgram = !filterProgram || player.program === filterProgram;
    
    const matchesStatus = filterStatus === 'all' || player.status === filterStatus;
    
    return matchesSearch && matchesProgram && matchesStatus;
  });

  // Action handlers
  const handleAddPlayer = (player: Player) => {
    setPlayers([...players, player]);
    toast({
      title: "Player Added",
      description: `${player.name} has been added successfully`,
    });
  };

  const handleUpdatePlayer = (player: Player) => {
    setPlayers(players.map(p => p.id === player.id ? player : p));
    setEditingPlayer(null);
    toast({
      title: "Player Updated",
      description: `${player.name}'s information has been updated`,
    });
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
    toast({
      title: "Player Deleted",
      description: "The player has been removed from the system",
      variant: "destructive",
    });
  };

  const handleSendMessage = () => {
    if (!messagePlayer) return;
    
    toast({
      title: "Schedule Sent",
      description: `Schedule has been sent to ${messagePlayer.name}`,
    });
    
    setMessagePlayer(null);
    setMessageContent('');
  };

  const handleRegisterActivity = (player: Player, activityIds: string[]) => {
    // Update the activities with the player's ID
    const updatedActivities = extraActivities.map(activity => {
      if (activityIds.includes(activity.id)) {
        return {
          ...activity,
          participants: [...activity.participants, player.id]
        };
      }
      return activity;
    });
    
    setExtraActivities(updatedActivities);
    
    toast({
      title: "Activities Registered",
      description: `${player.name} has been registered for ${activityIds.length} activities`,
    });
  };

  const handleRegisterForActivities = () => {
    if (!messagePlayer) return;
    
    handleRegisterActivity(messagePlayer, selectedActivities);
    setSelectedActivities([]);
    setMessagePlayer(null);
  };

  const handleSetObjectives = (playerId: string, objectives: any) => {
    setPlayers(players.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          objectives: {
            ...p.objectives,
            ...objectives
          }
        };
      }
      return p;
    }));
    
    toast({
      title: "Objectives Updated",
      description: "The player's objectives have been updated",
    });
  };

  // Clear filters handler
  const resetFilters = () => {
    setSearchQuery('');
    setProgramFilter('');
    setFilterTerm('');
    setFilterProgram('');
    setFilterStatus('all');
  };

  // Build context value
  const contextValue: PlayerContextType = {
    players,
    setPlayers,
    filteredPlayers,
    filterTerm,
    setFilterTerm,
    filterProgram,
    setFilterProgram,
    filterStatus,
    setFilterStatus,
    editingPlayer,
    setEditingPlayer,
    messagePlayer,
    setMessagePlayer,
    messageContent,
    setMessageContent,
    selectedActivities,
    setSelectedActivities,
    extraActivities,
    availablePrograms,
    searchQuery,
    setSearchQuery,
    programFilter,
    setProgramFilter,
    resetFilters,
    scheduleType,
    setScheduleType,
    newPlayer,
    setNewPlayer,
    handleAddPlayer,
    handleUpdatePlayer,
    handleDeletePlayer,
    handleSendMessage,
    handleRegisterActivity,
    handleRegisterForActivities,
    handleSetObjectives
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};
