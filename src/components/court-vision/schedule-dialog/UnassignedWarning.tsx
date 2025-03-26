
import { AlertTriangle } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogAction, 
  AlertDialogCancel 
} from "@/components/ui/alert-dialog";
import { PersonData } from "../types";

interface UnassignedWarningProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  unassignedPeople: PersonData[];
  scheduleType: "day" | "week" | "month";
  onSendAnyway: () => void;
}

export function UnassignedWarning({
  open,
  setOpen,
  unassignedPeople,
  scheduleType,
  onSendAnyway
}: UnassignedWarningProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          Persone Non Assegnate
        </AlertDialogTitle>
        <AlertDialogDescription>
          <p>Le seguenti persone non hanno assegnazioni in questa {
            scheduleType === "day" ? "giornata" : 
            scheduleType === "week" ? "settimana" : "mese"
          }:</p>
          <ul className="mt-2 space-y-1">
            {unassignedPeople.map(person => (
              <li key={person.id} className="text-sm">• {person.name}</li>
            ))}
          </ul>
          <p className="mt-4">Vuoi comunque inviare la programmazione?</p>
        </AlertDialogDescription>
        <div className="flex justify-end space-x-2 mt-4">
          <AlertDialogCancel>Rivedi Assegnazioni</AlertDialogCancel>
          <AlertDialogAction onClick={onSendAnyway}>
            Invia Comunque
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
