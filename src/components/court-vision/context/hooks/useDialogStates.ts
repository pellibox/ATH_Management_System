
import { useState } from "react";

export function useDialogStates() {
  const [showExtraHoursDialog, setShowExtraHoursDialog] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState(null);
  const [showCoachOverlapDialog, setShowCoachOverlapDialog] = useState(false);
  const [pendingCoachAssignment, setPendingCoachAssignment] = useState(null);

  const handleConfirmCoachOverlap = () => {
    console.log("Coach overlap confirmed");
    setShowCoachOverlapDialog(false);
    setPendingCoachAssignment(null);
  };

  const handleCancelCoachOverlap = () => {
    console.log("Coach overlap canceled");
    setShowCoachOverlapDialog(false);
    setPendingCoachAssignment(null);
  };

  const handleConfirmExtraHours = () => {
    console.log("Extra hours confirmed");
    setShowExtraHoursDialog(false);
    setPendingAssignment(null);
  };

  const handleCancelExtraHours = () => {
    console.log("Extra hours canceled");
    setShowExtraHoursDialog(false);
    setPendingAssignment(null);
  };

  const getCurrentHours = () => {
    return 0; // This would need actual implementation
  };

  const getNewHours = () => {
    return 0; // This would need actual implementation
  };

  return {
    showExtraHoursDialog,
    setShowExtraHoursDialog,
    pendingAssignment,
    setPendingAssignment,
    showCoachOverlapDialog,
    setShowCoachOverlapDialog,
    pendingCoachAssignment,
    setPendingCoachAssignment,
    handleConfirmCoachOverlap,
    handleCancelCoachOverlap,
    handleConfirmExtraHours,
    handleCancelExtraHours,
    getCurrentHours,
    getNewHours
  };
}
