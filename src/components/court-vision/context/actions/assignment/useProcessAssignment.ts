
import { useState } from "react";
import { PersonData } from "../../../types";

export const useProcessAssignment = (
  courts: any[],
  setCourts: React.Dispatch<React.SetStateAction<any[]>>,
  people: PersonData[],
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>,
  selectedDate: Date,
  timeSlots: string[]
) => {
  const [showCoachOverlapDialog, setShowCoachOverlapDialog] = useState(false);
  const [pendingCoachAssignment, setPendingCoachAssignment] = useState<any>(null);

  const processAssignment = (
    courtId: string, 
    person: PersonData, 
    position?: { x: number, y: number }, 
    timeSlot?: string
  ) => {
    console.log("Processing assignment:", { courtId, person, position, timeSlot });
    
    // Simplified implementation for the refactoring
    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        return {
          ...court,
          occupants: [...court.occupants, { ...person, position, timeSlot }]
        };
      }
      return court;
    });
    
    setCourts(updatedCourts);
  };

  const handleConfirmCoachOverlap = () => {
    if (pendingCoachAssignment) {
      const { courtId, coach, position, timeSlot } = pendingCoachAssignment;
      processAssignment(courtId, coach, position, timeSlot);
    }
    setPendingCoachAssignment(null);
    setShowCoachOverlapDialog(false);
  };

  const handleCancelCoachOverlap = () => {
    setPendingCoachAssignment(null);
    setShowCoachOverlapDialog(false);
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
