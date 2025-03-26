
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { AssignmentDialogContent } from "./AssignmentDialogContent";
import { CourtAssignmentProps } from "./types";

interface MobileDrawerProps extends CourtAssignmentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function MobileDrawer({
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
}: MobileDrawerProps) {
  return (
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
      </DrawerContent>
    </Drawer>
  );
}
