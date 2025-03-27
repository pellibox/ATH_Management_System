
import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { PERSON_TYPES } from "../constants";
import { PersonData, ActivityData } from "../types";
import { useToast } from "@/hooks/use-toast";
import { Clock, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCourtVision } from "../context/CourtVisionContext";
import { useCoachValidation } from "../validation/CoachValidationManager";
import { getProgramBasedDuration, getProgramBasedDailyLimit } from "../utils/personUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [showCoachConfirmDialog, setShowCoachConfirmDialog] = useState(false);
  const [pendingCoach, setPendingCoach] = useState<PersonData | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showPlayerLimitDialog, setShowPlayerLimitDialog] = useState(false);
  const [pendingPlayer, setPendingPlayer] = useState<PersonData | null>(null);
  const [playerLimitMessage, setPlayerLimitMessage] = useState("");
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { courts } = useCourtVision();
  const { validateCoachAssignment, validateWithDelay } = useCoachValidation();
  
  const validationDelay = 5000;

  const checkCoachAssignment = (person: PersonData): boolean => {
    const currentCourt = courts.find(c => c.id === courtId);
    if (!currentCourt) return false;
    
    const validationResults = validateCoachAssignment(
      person, 
      currentCourt, 
      courts, 
      time
    );
    
    if (validationResults.length > 0) {
      setPendingCoach(person);
      setConfirmationMessage(validationResults[0].message + " Confermare comunque?");
      setShowCoachConfirmDialog(true);
      return true;
    }
    
    return false;
  };
  
  const confirmCoachAssignment = () => {
    if (!pendingCoach) return;
    
    const personWithStatus = {
      ...pendingCoach,
      status: "conflict" as const
    };
    onDrop(courtId, personWithStatus, undefined, time);
    console.log("Coach conflict exception logged:", {
      coach: pendingCoach.name,
      courtId,
      time,
      confirmedBy: "User",
      timestamp: new Date().toISOString()
    });
    toast({
      title: "Confermato",
      description: "Coach assegnato nonostante il conflitto"
    });
  };
  
  const cancelCoachAssignment = () => {
    toast({
      title: "Annullato",
      description: "Assegnazione coach annullata"
    });
  };

  const checkPlayerLimits = (person: PersonData): boolean => {
    if (person.type === PERSON_TYPES.PLAYER) {
      const dailyLimit = person.dailyLimit || getProgramBasedDailyLimit(person);
      const currentHours = person.hoursAssigned || 0;
      const durationHours = person.durationHours || getProgramBasedDuration(person);
      
      if (currentHours + durationHours > dailyLimit) {
        setPendingPlayer(person);
        setPlayerLimitMessage(`${person.name} ha già raggiunto il limite di ore giornaliere (${currentHours}/${dailyLimit}h). Confermare comunque?`);
        setShowPlayerLimitDialog(true);
        return true;
      }
    }
    return false;
  };
  
  const confirmPlayerAssignment = () => {
    if (!pendingPlayer) return;
    
    const personWithStatus = {
      ...pendingPlayer,
      status: "pending" as const
    };
    onDrop(courtId, personWithStatus, undefined, time);
    toast({
      title: "Confermato",
      description: "Giocatore assegnato nonostante il limite superato"
    });
  };
  
  const cancelPlayerAssignment = () => {
    toast({
      title: "Annullato",
      description: "Assegnazione giocatore annullata"
    });
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [PERSON_TYPES.PLAYER, PERSON_TYPES.COACH, "activity"],
    hover: (item: any) => {
      if ((item.type === PERSON_TYPES.PLAYER || item.type === PERSON_TYPES.COACH)) {
        const duration = item.durationHours || 
                        (item.type === PERSON_TYPES.PLAYER ? getProgramBasedDuration(item) : 1);
        
        setExtendedPreview({
          duration: duration,
          type: item.type,
          color: item.programColor || (item.programId ? `var(--color-${item.programId})` : undefined)
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
        const activity = item as ActivityData;
        
        const activityWithStatus = {
          ...activity,
          status: "confirmed" as const
        };
        
        onActivityDrop(courtId, activityWithStatus, time);
      } else {
        const person = item as PersonData;
        
        const hasCoachConflict = person.type === PERSON_TYPES.COACH && checkCoachAssignment(person);
        const hasPlayerLimitExceeded = person.type === PERSON_TYPES.PLAYER && checkPlayerLimits(person);
        
        if (!hasCoachConflict && !hasPlayerLimitExceeded) {
          const personWithStatus = {
            ...person,
            status: "confirmed" as const
          };
          
          onDrop(courtId, personWithStatus, undefined, time);
          
          const currentCourt = courts.find(c => c.id === courtId);
          if (currentCourt && person.type === "coach") {
            validateWithDelay(person, currentCourt, courts, time, validationDelay);
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [courtId, time, onDrop, onActivityDrop, courts]);

  let previewStyle = {};
  let previewClass = "";
  
  if (extendedPreview) {
    const slotsNeeded = Math.ceil(extendedPreview.duration * 2);
    const heightPercent = slotsNeeded * 100;
    
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

  const mobilePlacementView = isMobile ? (
    <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-20">
      <div className="bg-white shadow-lg rounded-lg p-4 max-w-[90%]">
        <h3 className="font-medium mb-2">Seleziona persona da assegnare</h3>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        ref={drop}
        className="absolute inset-0 z-10"
        onMouseLeave={() => setExtendedPreview(null)}
      >
        {isOver && extendedPreview && (
          <div 
            className={`absolute left-0 right-0 top-0 ${previewClass} rounded-md transition-all duration-200 flex items-center justify-center hw-accelerated`}
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
      
      {/* Coach Conflict Confirmation Dialog */}
      <AlertDialog 
        open={showCoachConfirmDialog} 
        onOpenChange={setShowCoachConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma assegnazione coach</AlertDialogTitle>
            <AlertDialogDescription>{confirmationMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelCoachAssignment}>
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCoachAssignment}>
              Conferma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Player Limit Confirmation Dialog */}
      <AlertDialog 
        open={showPlayerLimitDialog} 
        onOpenChange={setShowPlayerLimitDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limite ore superato</AlertDialogTitle>
            <AlertDialogDescription>{playerLimitMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelPlayerAssignment}>
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmPlayerAssignment}>
              Conferma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
