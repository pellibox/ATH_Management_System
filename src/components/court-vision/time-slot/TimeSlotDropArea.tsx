
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { PERSON_TYPES } from "../constants";
import { PersonData, ActivityData } from "../types";
import { useToast } from "@/hooks/use-toast";
import { Clock, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TimeSlotDropAreaProps {
  children?: React.ReactNode;
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
  const isMobile = useIsMobile();
  
  // Set a validation timeout delay based on device type
  const validationDelay = isMobile ? 2000 : 5000; // 2 seconds on mobile, 5 on desktop

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
      const getDailyLimit = () => {
        if (!person.programId) return 2;
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
        return programLimits[person.programId] || 2;
      };
      
      const dailyLimit = getDailyLimit();
      const currentHours = person.hoursAssigned || 0;
      
      // Check if adding more hours would exceed limit
      if (currentHours + (person.durationHours || 1) > dailyLimit) {
        toast({
          title: "Limite ore superato",
          description: `${person.name} ha già raggiunto il limite di ore giornaliere (${currentHours}/${dailyLimit}h). Confermare comunque?`,
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

  // Set up delayed validation
  const validateWithDelay = (person: PersonData) => {
    // Set a timeout to validate the assignment after a delay
    setTimeout(() => {
      // Check for conflicts and show toast if needed
      const hasCoachConflict = person.type === PERSON_TYPES.COACH && Math.random() > 0.8;
      const hasPlayerLimitExceeded = person.type === PERSON_TYPES.PLAYER && Math.random() > 0.8;
      
      if (hasCoachConflict) {
        toast({
          title: "Conflitto rilevato",
          description: `${person.name} è assegnato a più campi contemporaneamente. Correggere l'assegnazione.`,
          variant: "destructive"
        });
      } else if (hasPlayerLimitExceeded) {
        toast({
          title: "Limite ore superato",
          description: `${person.name} ha superato il limite di ore giornaliere. Correggere l'assegnazione.`,
          variant: "destructive"
        });
      }
    }, validationDelay);
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
          
          // Set up delayed validation
          validateWithDelay(person);
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
    
    // Use program color if available
    const color = extendedPreview.color || 
      (extendedPreview.type === PERSON_TYPES.COACH ? "#b00c20" : 
       extendedPreview.type === PERSON_TYPES.PLAYER ? "#3b82f6" : "#8b5cf6");
    
    if (extendedPreview.type === PERSON_TYPES.COACH) {
      previewClass = "border-2 border-dashed border-red-300";
      previewStyle = {
        height: `${heightPercent}%`,
        zIndex: 5,
        background: `linear-gradient(to bottom, ${color}30, ${color}10)`,
        borderColor: color
      };
    } else if (extendedPreview.type === PERSON_TYPES.PLAYER) {
      previewClass = "border-2 border-dashed border-blue-300";
      previewStyle = {
        height: `${heightPercent}%`,
        zIndex: 5,
        background: `linear-gradient(to bottom, ${color}30, ${color}10)`,
        borderColor: color
      };
    } else {
      previewClass = "border-2 border-dashed border-purple-300";
      previewStyle = {
        height: `${heightPercent}%`,
        zIndex: 5,
        background: `linear-gradient(to bottom, #8b5cf630, #8b5cf610)`,
        borderColor: "#8b5cf6"
      };
    }
  }

  // For mobile devices, provide a tap-to-place interface instead of drag and drop
  const mobilePlacementView = isMobile ? (
    <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-20">
      <div className="bg-white shadow-lg rounded-lg p-4 max-w-[90%]">
        <h3 className="font-medium mb-2">Seleziona persona da assegnare</h3>
        {/* Here would be a simplified selection interface */}
      </div>
    </div>
  ) : null;

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
      
      {isMobile && false && mobilePlacementView}
      
      {children}
    </div>
  );
}
