
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeSlotHeaderProps {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
  setIsEditing: (editing: number | null) => void;
}

export default function TimeSlotHeader({ isAdding, setIsAdding, setIsEditing }: TimeSlotHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Time Slots Management</h2>
      
      {!isAdding && (
        <Button
          onClick={() => {
            setIsAdding(true);
            setIsEditing(null);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Time Slot</span>
        </Button>
      )}
    </div>
  );
}
