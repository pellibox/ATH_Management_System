
import { Edit, Trash, Clock } from "lucide-react";

interface TimeSlotItemProps {
  timeSlot: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TimeSlotItem({ timeSlot, onEdit, onDelete }: TimeSlotItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col hover:border-gray-300 transition-colors">
      <div className="flex items-center mb-2">
        <Clock className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="font-medium text-lg">{timeSlot}</h3>
      </div>
      <div className="flex justify-end mt-auto gap-2">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-full hover:bg-gray-100"
        >
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-full hover:bg-red-100"
        >
          <Trash className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
}
