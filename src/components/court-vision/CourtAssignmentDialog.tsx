
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useState } from "react";
import { PersonData, ActivityData, CourtProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { AssignmentDialogContent } from "./court-assignment/AssignmentDialogContent";

interface CourtAssignmentDialogProps {
  courts: CourtProps[];
  availablePeople: PersonData[];
  availableActivities: ActivityData[];
  timeSlots: string[]; 
  onAssignPerson: (courtId: string, person: PersonData, timeSlot?: string) => void;
  onAssignActivity: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson?: (personId: string, timeSlot?: string) => void;
  onRemoveActivity?: (activityId: string, timeSlot?: string) => void;
}

export function CourtAssignmentDialog({
  courts,
  availablePeople,
  availableActivities,
  timeSlots = [],
  onAssignPerson,
  onAssignActivity,
  onRemovePerson,
  onRemoveActivity,
}: CourtAssignmentDialogProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Shared content for both mobile and desktop views
  const dialogContent = (
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
  );

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full mb-4 border-ath-red-clay text-ath-red-clay">
          <Users className="h-4 w-4 mr-2" /> <span className="truncate">Assegna ai Campi</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white">
        <DrawerHeader>
          <DrawerTitle>Assegna ai Campi</DrawerTitle>
        </DrawerHeader>
        {dialogContent}
      </DrawerContent>
    </Drawer>
  ) : (
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
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
