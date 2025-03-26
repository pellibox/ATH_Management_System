
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PersonData } from "./types";

interface ExtraHoursConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingAssignment: {
    courtId: string;
    person: PersonData;
    position?: { x: number, y: number };
    timeSlot?: string;
  } | null;
  currentHours: number;
  newHours: number;
  onConfirm: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onCancel: () => void;
}

export const ExtraHoursConfirmationDialog: React.FC<ExtraHoursConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  pendingAssignment,
  currentHours,
  newHours,
  onConfirm,
  onCancel
}) => {
  if (!pendingAssignment) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conferma Ore Extra</DialogTitle>
          <DialogDescription>
            {pendingAssignment.person.name} ha già {currentHours} ore assegnate oggi.
            Questa assegnazione porterà il totale a {newHours} ore.
            Vuoi procedere con l'assegnazione?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Annulla
          </Button>
          <Button onClick={() => {
            if (pendingAssignment) {
              const { courtId, person, position, timeSlot } = pendingAssignment;
              onConfirm(courtId, person, position, timeSlot);
            }
          }}>
            Conferma
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
