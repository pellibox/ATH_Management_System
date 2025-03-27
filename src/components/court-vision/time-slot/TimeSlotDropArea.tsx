
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { PERSON_TYPES } from "../constants";
import { PersonData, ActivityData } from "../types";
import { useToast } from "@/hooks/use-toast";
import { Clock } from "lucide-react";

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
  const [extendedPreview, setExtendedPreview] = useState<{
    duration: number;
    type: string;
    color?: string;
  } | null>(null);
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
      // Get player daily limit from program
      const dailyLimit = person.programId ? 4 : 2; // Example limit based on program
      const currentHours = person.hoursAssigned || 0;
      
      // Check if adding more hours would exceed limit
      if (currentHours + (person.durationHours || 1) > dailyLimit) {
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
      if ((item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH)) {
        const duration = item.durationHours || 1;
        setExtendedPreview({
          duration: duration,
          type: item.type,
          color: item.programColor
        });
      } else if (item.type === "activity") {
        const duration = item.durationHours || 1;
        setExtendedPreview({
          duration: duration,
          type: "activity"
        });
      }
    },
    drop: (item: any) => {
      setExtendedPreview(null);
      
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

  // Calculate preview style based on preview duration
  let previewStyle = {};
  let previewClass = "";
  
  if (extendedPreview) {
    // Calculate height based on number of 30-min slots
    const slotsNeeded = Math.ceil(extendedPreview.duration * 2);
    const heightPercent = slotsNeeded * 100;
    
    if (extendedPreview.type === PERSON_TYPES.COACH) {
      const color = extendedPreview.color || "#b00c20";
      previewClass = "bg-gradient-to-b from-red-100 to-red-50 border-2 border-dashed border-red-300";
    } else if (extendedPreview.type === PERSON_TYPES.PLAYER) {
      previewClass = "bg-gradient-to-b from-blue-100 to-blue-50 border-2 border-dashed border-blue-300";
    } else {
      previewClass = "bg-gradient-to-b from-purple-100 to-purple-50 border-2 border-dashed border-purple-300";
    }
    
    previewStyle = {
      height: `${heightPercent}%`,
      zIndex: 5,
    };
  }

  return (
    <div
      ref={drop}
      className="absolute inset-0 z-10"
      onMouseLeave={() => setExtendedPreview(null)}
    >
      {isOver && extendedPreview && (
        <div 
          className={`absolute left-0 right-0 top-0 ${previewClass} rounded-md transition-all duration-200 flex items-center justify-center`}
          style={previewStyle}
        >
          <div className="flex items-center bg-white/80 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            <span className="text-xs font-medium">{extendedPreview.duration}h</span>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}
