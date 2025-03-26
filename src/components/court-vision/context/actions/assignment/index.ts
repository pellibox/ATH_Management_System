
import { useState } from "react";
import { PersonData } from "../../../types";
import { PERSON_TYPES } from "../../../constants";
import { AssignmentActionsProps } from "./types";
import { getPlayerDailyHours } from "./utils";
import { usePersonAssignment } from "./usePersonAssignment";
import { useActivityAssignment } from "./useActivityAssignment";
import { useExtraHoursDialog } from "./useExtraHoursDialog";

export const useAssignmentActions = ({
  courts,
  setCourts,
  people,
  setPeople,
  programs,
  selectedDate,
  timeSlots
}: AssignmentActionsProps) => {
  // Set up the person assignment functionality
  const {
    processAssignment,
    handleRemovePerson,
    handleAddToDragArea,
    showExtraHoursDialog,
    setShowExtraHoursDialog,
    pendingAssignment,
    setPendingAssignment,
    showCoachOverlapDialog,
    setShowCoachOverlapDialog,
    pendingCoachAssignment,
    handleConfirmCoachOverlap,
    handleCancelCoachOverlap
  } = usePersonAssignment(courts, setCourts, people, setPeople, selectedDate, timeSlots);

  // Set up the activity assignment functionality
  const {
    handleActivityDrop,
    handleRemoveActivity,
    handleAssignPlayerToActivity
  } = useActivityAssignment(courts, setCourts, selectedDate, timeSlots);

  // Set up the extra hours dialog functionality
  const {
    handleConfirmExtraHours,
    handleCancelExtraHours,
    getCurrentHours,
    getNewHours
  } = useExtraHoursDialog(
    courts,
    pendingAssignment,
    setPendingAssignment,
    setShowExtraHoursDialog,
    processAssignment
  );

  // Main drop handler that integrates with extra hours checking
  const handleDrop = (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => {
    console.log("handleDrop called:", { courtId, person, position, timeSlot });
    
    // Check if this is a player with existing assignments
    if (person.type === PERSON_TYPES.PLAYER) {
      const currentHours = getPlayerDailyHours(person.id, courts);
      // If player already has assignments and this would add more hours
      if (currentHours > 0) {
        // Store the pending assignment and show dialog
        setPendingAssignment({ courtId, person, position, timeSlot });
        setShowExtraHoursDialog(true);
        return;
      }
    }
    
    // Proceed with assignment
    processAssignment(courtId, person, position, timeSlot);
  };

  return {
    handleDrop,
    handleActivityDrop,
    handleRemovePerson,
    handleRemoveActivity,
    handleAddToDragArea,
    handleAssignPlayerToActivity,
    showExtraHoursDialog,
    setShowExtraHoursDialog,
    pendingAssignment,
    getCurrentHours,
    getNewHours,
    handleConfirmExtraHours,
    handleCancelExtraHours,
    showCoachOverlapDialog,
    setShowCoachOverlapDialog,
    pendingCoachAssignment,
    handleConfirmCoachOverlap,
    handleCancelCoachOverlap
  };
};
