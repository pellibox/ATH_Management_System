
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { AssignmentDialogContent } from "./AssignmentDialogContent";
import { CourtAssignmentProps } from "./types";

interface DesktopDialogProps extends CourtAssignmentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DesktopDialog({
  courts,
  availablePeople,
  availableActivities,
  timeSlots = [],
  onAssignPerson,
  onAssignActivity,
  onRemovePerson,
  onRemoveActivity,
  open,
  setOpen
}: DesktopDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-4 border-ath-red-clay text-ath-red-clay">
          <Users className="h-4 w-4 mr-2" /> <span className="truncate">Assegna ai Campi</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Assegna ai Campi</DialogTitle>
        </DialogHeader>
        <AssignmentDialogContent 
          courts={courts}
          availablePeople={availablePeople}
          availableActivities={availableActivities}
          timeSlots={timeSlots}
          onAssignPerson={onAssignPerson}
          onAssignActivity={onAssignActivity}
          onRemovePerson={onRemovePerson}
          onRemoveActivity={onRemoveActivity}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
