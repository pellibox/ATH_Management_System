
import { PersonData } from "../../../types";
import { getPlayerDailyHours } from "./utils";
import { PendingAssignment } from "./types";

export const useExtraHoursDialog = (
  courts: any[],
  pendingAssignment: PendingAssignment | null,
  setPendingAssignment: React.Dispatch<React.SetStateAction<PendingAssignment | null>>,
  setShowExtraHoursDialog: React.Dispatch<React.SetStateAction<boolean>>,
  processAssignment: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void
) => {
  const handleConfirmExtraHours = () => {
    if (pendingAssignment) {
      const { courtId, person, position, timeSlot } = pendingAssignment;
      processAssignment(courtId, person, position, timeSlot);
      setPendingAssignment(null);
      setShowExtraHoursDialog(false);
    }
  };

  const handleCancelExtraHours = () => {
    setPendingAssignment(null);
    setShowExtraHoursDialog(false);
  };

  const getCurrentHours = (): number => {
    if (!pendingAssignment) return 0;
    return getPlayerDailyHours(pendingAssignment.person.id, courts);
  };

  const getNewHours = (): number => {
    if (!pendingAssignment) return 0;
    const currentHours = getCurrentHours();
    return currentHours + (pendingAssignment.person.durationHours || 1);
  };

  return {
    handleConfirmExtraHours,
    handleCancelExtraHours,
    getCurrentHours,
    getNewHours
  };
};
