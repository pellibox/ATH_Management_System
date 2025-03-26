
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from "@/components/ui/dialog";
import { PersonData, CourtProps } from "../types";
import { PlayerScheduleTemplate } from "../schedule/PlayerScheduleTemplate";
import { CoachScheduleTemplate } from "../schedule/CoachScheduleTemplate";

interface SchedulePreviewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  previewPerson: PersonData | null;
  date: Date;
  courts: CourtProps[];
  timeSlots: string[];
}

export function SchedulePreviewDialog({
  open,
  setOpen,
  previewPerson,
  date,
  courts,
  timeSlots
}: SchedulePreviewDialogProps) {
  if (!previewPerson) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle>Anteprima Programmazione</DialogTitle>
          <DialogClose className="absolute right-0 top-0">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="py-4">
          {previewPerson.type === "player" ? (
            <PlayerScheduleTemplate 
              player={previewPerson} 
              date={date} 
              courts={courts} 
              timeSlots={timeSlots} 
            />
          ) : (
            <CoachScheduleTemplate 
              coach={previewPerson} 
              date={date} 
              courts={courts} 
              timeSlots={timeSlots} 
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
