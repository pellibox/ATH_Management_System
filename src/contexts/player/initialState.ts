
import { Player } from "@/types/player";
import { mockPlayers } from "@/types/player";
import { ExtraActivity } from "@/types/extra-activities";

// Initial state for objectives
export const defaultObjectives = {
  daily: "",
  weekly: "",
  monthly: "",
  seasonal: ""
};

// Initial state for new player
export const defaultNewPlayer: Omit<Player, "id"> = {
  name: "",
  age: 0,
  level: "Beginner",
  phone: "",
  email: "",
  notes: "",
  status: "active",
  
  // Add properties that were causing errors
  gender: "Male",
  coach: "",
  joinDate: new Date().toISOString().split("T")[0],
  preferredContactMethod: "WhatsApp",
  objectives: {
    daily: "",
    weekly: "",
    monthly: "",
    seasonal: ""
  }
};

// Mock data for extra activities
export const mockExtraActivities: ExtraActivity[] = [
  {
    id: "athletic-1",
    title: "Preparazione Atletica Settimanale",
    name: "Preparazione Atletica Settimanale",
    type: "athletic",
    time: "17:00",
    duration: 1.5,
    days: [1, 3, 5], // Lunedì, Mercoledì, Venerdì
    location: "Palestra",
    maxParticipants: 8,
    participants: ["p1", "p2", "p3"],
    coach: "coach-1",
    notes: "Portare abbigliamento sportivo e scarpe da ginnastica",
    date: new Date().toISOString().split('T')[0],
    startTime: "17:00",
    endTime: "18:30"
  },
  {
    id: "mental-1",
    title: "Sessione di Mindfulness",
    name: "Sessione di Mindfulness",
    type: "mental",
    time: "16:00",
    duration: 1,
    days: [2, 4], // Martedì, Giovedì
    location: "Sala Conferenze",
    maxParticipants: 10,
    participants: ["p2", "p4"],
    coach: "coach-2",
    notes: "Portare tappetino yoga",
    date: new Date().toISOString().split('T')[0],
    startTime: "16:00",
    endTime: "17:00"
  }
];
