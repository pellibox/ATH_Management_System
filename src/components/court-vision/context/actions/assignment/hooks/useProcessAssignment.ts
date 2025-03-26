
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PersonData } from "../../../../types";
import { 
  preparePersonAssignment, 
  removePersonFromSource, 
  addPersonToCourt,
  checkCoachOverlap
} from "../utils/personAssignmentUtils";

/**
 * Hook to handle the core assignment processing logic
 */
export const useProcessAssignment = (
  courts: any[],
  setCourts: React.Dispatch<React.SetStateAction<any[]>>,
  people: PersonData[],
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>,
  selectedDate: Date,
  timeSlots: string[]
) => {
  const { toast } = useToast();
  const [showCoachOverlapDialog, setShowCoachOverlapDialog] = useState(false);
  const [pendingCoachAssignment, setPendingCoachAssignment] = useState<{
    courtId: string;
    coach: PersonData;
    position?: { x: number; y: number };
    timeSlot?: string;
    existingCourtName: string;
  } | null>(null);

  const processAssignment = (
    courtId: string, 
    person: PersonData, 
    position?: { x: number, y: number }, 
    timeSlot?: string
  ) => {
    // Check for coach overlap if this is a coach
    if (person.type === "coach" && timeSlot) {
      const overlap = checkCoachOverlap(courts, person.id, courtId, timeSlot);
      
      if (overlap) {
        const existingCourt = courts.find(c => c.id === overlap.courtId);
        const existingCourtName = existingCourt ? `${existingCourt.name} #${existingCourt.number}` : "Unknown";
        
        setPendingCoachAssignment({
          courtId,
          coach: person,
          position,
          timeSlot,
          existingCourtName
        });
        
        setShowCoachOverlapDialog(true);
        return;
      }
    }

    // Continue with normal assignment process
    completeAssignment(courtId, person, position, timeSlot);
  };

  const completeAssignment = (
    courtId: string, 
    person: PersonData, 
    position?: { x: number, y: number }, 
    timeSlot?: string
  ) => {
    // Check if moving from an existing assignment (with source info)
    const isMovingFromExistingAssignment = person.sourceTimeSlot || person.courtId;

    // Keep track of the source time slot and court ID for possible removal later
    const sourceTimeSlot = person.timeSlot || person.sourceTimeSlot;
    const sourceCourtId = person.courtId;

    // Prepare the person object with court info, including proper time slot calculations
    const personWithCourtInfo = preparePersonAssignment(
      person, 
      courtId, 
      position, 
      timeSlot,
      timeSlots
    );
    
    // Set the date explicitly to the selected date's ISO string date part
    const dateString = selectedDate.toISOString().split('T')[0];
    personWithCourtInfo.date = dateString;

    // Remove from source if needed
    let updatedCourts = removePersonFromSource(
      courts,
      person,
      sourceTimeSlot,
      sourceCourtId
    );

    // Add person to the target court
    updatedCourts = addPersonToCourt(
      updatedCourts,
      courtId,
      personWithCourtInfo
    );

    console.log("Updated courts after drop:", updatedCourts);
    setCourts(updatedCourts);

    // Remove from available list if coming from there (for players only)
    const isFromAvailableList = people.some(p => p.id === person.id);
    if (isFromAvailableList && person.type === "player") {
      setPeople(people.filter(p => p.id !== person.id));
    }

    // Construct message with duration info
    const durationText = personWithCourtInfo.durationHours && personWithCourtInfo.durationHours > 1 
      ? ` per ${personWithCourtInfo.durationHours} ore`
      : '';
    
    // Show success notification
    toast({
      title: isMovingFromExistingAssignment ? "Persona Spostata" : "Persona Assegnata",
      description: `${person.name} è stata ${isMovingFromExistingAssignment ? "spostata" : "assegnata"} al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}${durationText}`,
    });
  };

  const handleConfirmCoachOverlap = () => {
    if (!pendingCoachAssignment) return;
    
    const { courtId, coach, position, timeSlot } = pendingCoachAssignment;
    completeAssignment(courtId, coach, position, timeSlot);
    
    // Reset state
    setShowCoachOverlapDialog(false);
    setPendingCoachAssignment(null);
    
    // Show warning about the overlap
    toast({
      title: "Sovrapposizione Confermata",
      description: `${coach.name} è stato assegnato a più campi contemporaneamente`,
      variant: "destructive",
    });
  };

  const handleCancelCoachOverlap = () => {
    setShowCoachOverlapDialog(false);
    setPendingCoachAssignment(null);
  };

  return { 
    processAssignment,
    showCoachOverlapDialog,
    setShowCoachOverlapDialog,
    pendingCoachAssignment,
    handleConfirmCoachOverlap,
    handleCancelCoachOverlap
  };
};
