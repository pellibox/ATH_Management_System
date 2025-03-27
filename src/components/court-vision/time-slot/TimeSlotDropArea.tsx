
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { PERSON_TYPES } from "../constants";
import { PersonData, ActivityData } from "../types";
import { useToast } from "@/hooks/use-toast";

interface TimeSlotDropAreaProps {
  children?: React.ReactNode; // Make children optional
  courtId: string;
  time: string;
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
}

export function TimeSlotDropArea({
  children,
  courtId,
  time,
  onDrop,
  onActivityDrop
}: TimeSlotDropAreaProps) {
  const [isExtendedPreview, setIsExtendedPreview] = useState(false);
  const { toast } = useToast();

  // Helper to check if a coach is already assigned elsewhere
  const checkCoachAssignment = (person: PersonData): boolean => {
    // This would check coach assignments across courts in a real implementation
    // For now, we'll simply show a confirmation toast
    if (person.type === PERSON_TYPES.COACH) {
      // Simulate coach already assigned
      if (Math.random() > 0.7) {
        toast({
          title: "Conferma assegnazione",
          description: `${person.name} è già assegnato al Campo 3 in questo orario. Confermare comunque?`,
          action: (
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 text-xs rounded bg-green-500 text-white"
                onClick={() => {
                  onDrop(courtId, person, undefined, time);
                  toast({
                    title: "Confermato",
                    description: "Coach assegnato nonostante il conflitto"
                  });
                }}
              >
                Conferma
              </button>
              <button 
                className="px-3 py-1 text-xs rounded bg-gray-300 text-gray-700"
                onClick={() => {
                  toast({
                    title: "Annullato",
                    description: "Assegnazione coach annullata"
                  });
                }}
              >
                Annulla
              </button>
            </div>
          )
        });
        return true;
      }
    }
    return false;
  };

  // Helper to check player daily limits
  const checkPlayerLimits = (person: PersonData): boolean => {
    if (person.type === PERSON_TYPES.PLAYER) {
      // This would check player's daily hours in a real implementation
      // For now, we'll simply show a confirmation toast randomly
      if (Math.random() > 0.7) {
        toast({
          title: "Limite ore superato",
          description: `${person.name} ha già raggiunto il limite di ore giornaliere. Confermare comunque?`,
          action: (
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 text-xs rounded bg-green-500 text-white"
                onClick={() => {
                  onDrop(courtId, person, undefined, time);
                  toast({
                    title: "Confermato",
                    description: "Giocatore assegnato nonostante il limite superato"
                  });
                }}
              >
                Conferma
              </button>
              <button 
                className="px-3 py-1 text-xs rounded bg-gray-300 text-gray-700"
                onClick={() => {
                  toast({
                    title: "Annullato",
                    description: "Assegnazione giocatore annullata"
                  });
                }}
              >
                Annulla
              </button>
            </div>
          )
        });
        return true;
      }
    }
    return false;
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity"],
    hover: (item: any) => {
      // Show extended preview for multi-slot occupancy
      if ((item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH) && 
          item.durationHours && item.durationHours > 1) {
        setIsExtendedPreview(true);
      }
    },
    drop: (item: any) => {
      setIsExtendedPreview(false);
      
      if (item.type === "activity") {
        // Handle activity drop
        const activity = item as ActivityData;
        onActivityDrop(courtId, activity, time);
      } else {
        // Handle person drop with validation
        const person = item as PersonData;
        
        // Check if coach already assigned or player over limit
        const hasCoachConflict = checkCoachAssignment(person);
        const hasPlayerLimitExceeded = checkPlayerLimits(person);
        
        // If no conflicts or user confirmed, proceed with drop
        if (!hasCoachConflict && !hasPlayerLimitExceeded) {
          onDrop(courtId, person, undefined, time);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [courtId, time, onDrop, onActivityDrop]);

  return (
    <div
      ref={drop}
      className={`absolute inset-0 z-10 ${
        isOver ? (isExtendedPreview ? "bg-blue-100/50 border-2 border-blue-300 border-dashed" : "bg-gray-100/50") : ""
      }`}
      onMouseLeave={() => setIsExtendedPreview(false)}
    >
      {children}
    </div>
  );
}
