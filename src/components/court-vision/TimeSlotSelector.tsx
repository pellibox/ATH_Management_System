
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clock, Plus, Minus } from "lucide-react";

interface TimeSlotSelectorProps {
  timeSlots: string[];
  onAddTimeSlot: (time: string) => void;
  onRemoveTimeSlot: (time: string) => void;
}

export function TimeSlotSelector({ timeSlots, onAddTimeSlot, onRemoveTimeSlot }: TimeSlotSelectorProps) {
  const [newTime, setNewTime] = useState("09:00");
  
  const handleAddTimeSlot = () => {
    if (newTime && !timeSlots.includes(newTime)) {
      onAddTimeSlot(newTime);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <h2 className="font-medium mb-3 flex items-center">
        <Clock className="h-4 w-4 mr-2" /> Fasce Orarie
      </h2>
      
      <div className="flex items-end space-x-2 mb-4">
        <div className="flex-1">
          <Label htmlFor="new-time" className="text-sm mb-1 block">Aggiungi fascia oraria</Label>
          <input
            id="new-time"
            type="time"
            className="w-full px-3 py-2 text-sm border rounded"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </div>
        <Button onClick={handleAddTimeSlot} size="sm" className="mb-0.5">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-1 max-h-[180px] overflow-y-auto">
        {timeSlots.length > 0 ? (
          timeSlots.sort().map((time) => (
            <div key={time} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm font-medium">{time}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onRemoveTimeSlot(time)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">Nessuna fascia oraria definita</p>
        )}
      </div>
    </div>
  );
}
