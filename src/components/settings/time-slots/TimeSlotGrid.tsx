
import TimeSlotItem from "./TimeSlotItem";
import TimeSlotForm from "./TimeSlotForm";

interface TimeSlotGridProps {
  timeSlots: string[];
  isAdding: boolean;
  isEditing: number | null;
  newTimeSlot: string;
  setNewTimeSlot: (value: string) => void;
  handleAddTimeSlot: () => void;
  handleEditTimeSlot: (index: number) => void;
  handleDeleteTimeSlot: (timeSlot: string) => void;
  startEdit: (index: number) => void;
  cancelEdit: () => void;
  setIsAdding: (isAdding: boolean) => void;
}

export default function TimeSlotGrid({
  timeSlots,
  isAdding,
  isEditing,
  newTimeSlot,
  setNewTimeSlot,
  handleAddTimeSlot,
  handleEditTimeSlot,
  handleDeleteTimeSlot,
  startEdit,
  cancelEdit,
  setIsAdding
}: TimeSlotGridProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isAdding && (
          <TimeSlotForm
            isAdding={true}
            isEditing={null}
            newTimeSlot={newTimeSlot}
            setNewTimeSlot={setNewTimeSlot}
            onSave={handleAddTimeSlot}
            onCancel={() => {
              setIsAdding(false);
              setNewTimeSlot("");
            }}
            title="New Time Slot"
          />
        )}
        
        {timeSlots.map((timeSlot, index) => (
          isEditing === index ? (
            <TimeSlotForm
              key={index}
              isAdding={false}
              isEditing={index}
              newTimeSlot={newTimeSlot}
              setNewTimeSlot={setNewTimeSlot}
              onSave={() => handleEditTimeSlot(index)}
              onCancel={cancelEdit}
              title="Edit Time Slot"
            />
          ) : (
            <TimeSlotItem
              key={index}
              timeSlot={timeSlot}
              onEdit={() => startEdit(index)}
              onDelete={() => handleDeleteTimeSlot(timeSlot)}
            />
          )
        ))}
      </div>
      
      {timeSlots.length === 0 && !isAdding && (
        <div className="text-center py-8">
          <p className="text-gray-500">No time slots defined</p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 text-ath-blue hover:text-ath-blue-dark"
          >
            Add your first time slot
          </button>
        </div>
      )}
    </div>
  );
}
