
import { Check, X } from "lucide-react";
import TimeSlotHeader from "./time-slots/TimeSlotHeader";
import TimeSlotGrid from "./time-slots/TimeSlotGrid";
import { useTimeSlots } from "./time-slots/useTimeSlots";

export default function TimeSlotsTab() {
  const {
    timeSlots,
    isEditing,
    newTimeSlot,
    isAdding,
    setIsAdding,
    setNewTimeSlot,
    setIsEditing,
    handleAddTimeSlot,
    handleEditTimeSlot,
    handleDeleteTimeSlot,
    startEdit,
    cancelEdit
  } = useTimeSlots();
  
  return (
    <div className="animate-fade-in">
      <TimeSlotHeader 
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        setIsEditing={setIsEditing}
      />
      
      {isAdding && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleAddTimeSlot}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors text-sm"
          >
            <Check className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewTimeSlot("");
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>
      )}
      
      <TimeSlotGrid 
        timeSlots={timeSlots}
        isAdding={isAdding}
        isEditing={isEditing}
        newTimeSlot={newTimeSlot}
        setNewTimeSlot={setNewTimeSlot}
        handleAddTimeSlot={handleAddTimeSlot}
        handleEditTimeSlot={handleEditTimeSlot}
        handleDeleteTimeSlot={handleDeleteTimeSlot}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        setIsAdding={setIsAdding}
      />
    </div>
  );
}
