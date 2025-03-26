
import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PersonData } from "./types";

interface CoachOverlapDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  coach: PersonData | null;
  existingCourt: string;
  newCourt: string;
  timeSlot: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CoachOverlapDialog({
  isOpen,
  onOpenChange,
  coach,
  existingCourt,
  newCourt,
  timeSlot,
  onConfirm,
  onCancel,
}: CoachOverlapDialogProps) {
  if (!coach) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Sovrapposizione Coach
          </DialogTitle>
          <DialogDescription>
            Il coach <strong>{coach.name}</strong> è già assegnato al campo{" "}
            <strong>{existingCourt}</strong> alle ore{" "}
            <strong>{timeSlot}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p>
            Vuoi comunque assegnare questo coach al campo{" "}
            <strong>{newCourt}</strong> alla stessa ora?
          </p>
          <p className="mt-2 text-sm text-amber-600">
            Nota: questo potrebbe creare problemi di organizzazione.
          </p>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onCancel}>
            Annulla
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Conferma Sovrapposizione
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
