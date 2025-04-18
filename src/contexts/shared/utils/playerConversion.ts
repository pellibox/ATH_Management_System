
import { PersonData } from "@/components/court-vision/types";
import { Player } from "@/types/player";
import { PERSON_TYPES } from "@/components/court-vision/constants";
import { calculateDailyLimit, calculateDefaultDuration } from "./programCalculations";

// Convert Player type to PersonData type
export const convertPlayerToPerson = (player: Player): PersonData => {
  return {
    id: player.id,
    name: player.name,
    type: PERSON_TYPES.PLAYER,
    email: player.email,
    phone: player.phone,
    programId: player.program, // Map program to programId
    programIds: player.programs, // Use programs array if available
    sportTypes: player.sports, // Map sports to sportTypes
    // Add other relevant fields
    notes: player.notes,
    // Hours tracking (these are now part of PersonData)
    completedHours: player.completedHours || 0,
    trainingHours: player.trainingHours || 0,
    extraHours: player.extraHours || 0,
    missedHours: player.missedHours || 0,
    // Program-based metrics
    dailyLimit: calculateDailyLimit(player),
    durationHours: calculateDefaultDuration(player),
    // Status - pass through from player
    status: player.status === 'inactive' ? "pending" : "confirmed"
  };
};

// Convert PersonData back to Player but only update specific fields
export const convertPersonToPlayer = (person: PersonData): Player => {
  return {
    id: person.id,
    name: person.name,
    email: person.email || "",
    phone: person.phone || "",
    level: "",
    // Add the required status property
    status: 'active', // Default to active to satisfy the type requirement
    // Only sync hours data because Court Vision can only update hours
    completedHours: person.completedHours,
    trainingHours: person.trainingHours,
    extraHours: person.extraHours,
    missedHours: person.missedHours
  };
};
