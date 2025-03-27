
import React from "react";
import { PersonData } from "../types";
import { CourtPerson } from "../CourtPerson";
import { isTimeSlotOccupied, getTimeSlotContinuationStyle } from "../court/CourtStyleUtils";
import { calculateProgramDuration, calculateTimeSlotSpan } from "./utils";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface TimeSlotOccupantsProps {
  occupants: PersonData[];
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  time: string;
  conflicts?: Record<string, string[]>;
}

export function TimeSlotOccupants({ 
  occupants, 
  onRemovePerson,
  time,
  conflicts = {}
}: TimeSlotOccupantsProps) {
  // Define timeSlots array for this component
  const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", 
                     "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
                     "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", 
                     "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
  
  if (!occupants || occupants.length === 0) {
    return <div className="relative w-full h-full"></div>;
  }

  // Group occupants by type for organization
  const coaches = occupants.filter(p => p.type === "coach");
  const players = occupants.filter(p => p.type === "player");

  // Check if a person has a conflict in this time slot
  const hasConflict = (person: PersonData): boolean => {
    const timeConflicts = conflicts[time] || [];
    return timeConflicts.includes(person.id);
  };

  // Calculate remaining hours for each player
  const getRemainingHours = (player: PersonData): number => {
    // Get daily limit based on program
    const getDailyLimit = () => {
      if (!player.programId) return 2;
      // Different programs have different daily limits
      const programLimits: Record<string, number> = {
        "perf2": 3,
        "perf3": 4.5,
        "perf4": 6,
        "elite": 7.5,
        "elite-full": 10,
        "junior-sit": 3,
        "junior-sat": 1.5,
      };
      return programLimits[player.programId] || 2;
    };
    
    const programLimit = getDailyLimit();
    const usedHours = player.hoursAssigned || player.durationHours || 1;
    return Math.max(0, programLimit - usedHours);
  };

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-wrap gap-1 absolute left-0 top-1/2 transform -translate-y-1/2 ml-2">
        {/* Display coaches first */}
        {coaches.map((coach, index) => {
          // Check if this is a continuation slot or the starting slot
          const isContinuationSlot = coach.timeSlot !== time && isTimeSlotOccupied(coach, time, timeSlots);
          const continuationStyle = getTimeSlotContinuationStyle(coach, time, timeSlots);
          
          // Only show remove button on the starting slot
          const showRemoveButton = coach.timeSlot === time;
          
          // For continuation slots, add special styling
          const personClass = isContinuationSlot ? `${continuationStyle} border-t border-dashed border-gray-300` : '';
          
          // Check for conflicts
          const coachHasConflict = hasConflict(coach);
          
          // Status style - confirmed, pending, conflict
          const statusStyle = coach.isPresent === false 
            ? 'opacity-50' // Unavailable coach
            : '';
          
          // Default to confirmed unless specified otherwise
          const isConfirmed = coach.status !== "pending";
          
          return (
            <div key={`coach-${coach.id}-${index}-${time}`} className="relative">
              <CourtPerson
                person={coach}
                index={index}
                total={coaches.length}
                onRemove={showRemoveButton ? () => onRemovePerson(coach.id, time) : undefined}
                className={`${personClass} ${statusStyle} z-10`}
                isSpanning={isContinuationSlot}
                hasConflict={coachHasConflict}
                isConfirmed={isConfirmed}
              />
            </div>
          );
        })}
        
        {/* Then display players */}
        {players.map((player, index) => {
          // Check if this is a continuation slot or the starting slot
          const isContinuationSlot = player.timeSlot !== time && isTimeSlotOccupied(player, time, timeSlots);
          const continuationStyle = getTimeSlotContinuationStyle(player, time, timeSlots);
          
          // Only show remove button on the starting slot
          const showRemoveButton = player.timeSlot === time;
          
          // For continuation slots, add special styling
          const personClass = isContinuationSlot ? `${continuationStyle} border-t border-dashed border-gray-300` : '';
          
          // Check for conflicts
          const playerHasConflict = hasConflict(player);
          
          // Default to confirmed unless specified otherwise
          const isConfirmed = player.status !== "pending";
          
          return (
            <div key={`player-${player.id}-${index}-${time}`} className="relative">
              <CourtPerson
                person={player}
                index={index}
                total={players.length}
                onRemove={showRemoveButton ? () => onRemovePerson(player.id, time) : undefined}
                className={`${personClass}`}
                isSpanning={isContinuationSlot}
                hasConflict={playerHasConflict}
                isConfirmed={isConfirmed}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
