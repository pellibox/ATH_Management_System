
import { Check, X } from "lucide-react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeSlotFormProps {
  isAdding: boolean;
  isEditing: number | null;
  newTimeSlot: string;
  setNewTimeSlot: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  title: string;
}

export default function TimeSlotForm({ 
  isAdding, 
  isEditing, 
  newTimeSlot, 
  setNewTimeSlot, 
  onSave, 
  onCancel,
  title
}: TimeSlotFormProps) {
  return (
    <div className={`bg-${isAdding ? 'blue' : 'white'}-50 border border-${isAdding ? 'blue' : 'gray'}-200 rounded-lg p-4 flex flex-col`}>
      <div className="flex items-center mb-3">
        <Clock className={`h-5 w-5 text-${isAdding ? 'blue' : 'gray'}-500 mr-2`} />
        <h3 className="font-medium">{title}</h3>
      </div>
      <input
        type="time"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 mb-3"
        value={newTimeSlot}
        onChange={(e) => setNewTimeSlot(e.target.value)}
      />
      <div className="flex justify-end mt-auto gap-2">
        <button
          onClick={onSave}
          className="p-1.5 rounded-full hover:bg-blue-200"
        >
          <Check className="w-4 h-4 text-blue-600" />
        </button>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-full hover:bg-gray-200"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
