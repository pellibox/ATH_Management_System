
import { Button } from "@/components/ui/button";

interface ActivityFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isEditing: boolean;
}

export function ActivityFormActions({ 
  onCancel, 
  onSave, 
  isEditing 
}: ActivityFormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel}>Annulla</Button>
      <Button onClick={onSave}>
        {isEditing ? "Salva Modifiche" : "Aggiungi Attività"}
      </Button>
    </div>
  );
}
