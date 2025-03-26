
import { useState } from "react";
import { PersonData } from "../../../types";
import { PendingAssignment } from "./types";
import { useProcessAssignment } from "./hooks/useProcessAssignment";
import { usePersonRemoval } from "./hooks/usePersonRemoval";
import { useDragArea } from "./hooks/useDragArea";

/**
 * Main hook for person assignment functionality
 * Composes more specialized hooks to handle different aspects of assignment
 */
export const usePersonAssignment = (
  courts: any[],
  setCourts: React.Dispatch<React.SetStateAction<any[]>>,
  people: PersonData[],
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>,
  selectedDate: Date,
  timeSlots: string[]
) => {
  const [showExtraHoursDialog, setShowExtraHoursDialog] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<PendingAssignment | null>(null);

  // Use our specialized hooks
  const { 
    processAssignment, 
    showCoachOverlapDialog,
    setShowCoachOverlapDialog,
    pendingCoachAssignment,
    handleConfirmCoachOverlap,
    handleCancelCoachOverlap
  } = useProcessAssignment(
    courts, 
    setCourts, 
    people, 
    setPeople, 
    selectedDate, 
    timeSlots
  );
  
  const { handleRemovePerson } = usePersonRemoval(
    courts, 
    setCourts, 
    people, 
    setPeople
  );
  
  const { handleAddToDragArea } = useDragArea(
    people, 
    setPeople
  );

  return {
    processAssignment,
    handleRemovePerson,
    handleAddToDragArea,
    showExtraHoursDialog,
    setShowExtraHoursDialog,
    pendingAssignment,
    setPendingAssignment,
    showCoachOverlapDialog,
    pendingCoachAssignment,
    handleConfirmCoachOverlap,
    handleCancelCoachOverlap
  };
};
