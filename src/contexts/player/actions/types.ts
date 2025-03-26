
import { Player } from "@/types/player";
import { ExtraActivity } from "@/types/extra-activities";
import React from "react";

export interface PlayerActionsProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  editingPlayer: Player | null;
  setEditingPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  messagePlayer: Player | null;
  setMessagePlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  messageContent: string;
  setMessageContent: React.Dispatch<React.SetStateAction<string>>;
  extraActivities: ExtraActivity[];
  setExtraActivities: React.Dispatch<React.SetStateAction<ExtraActivity[]>>;
  selectedActivities: string[];
  setSelectedActivities: React.Dispatch<React.SetStateAction<string[]>>;
  setObjectives: React.Dispatch<React.SetStateAction<{
    daily: string;
    weekly: string;
    monthly: string;
    seasonal: string;
  }>>;
}
