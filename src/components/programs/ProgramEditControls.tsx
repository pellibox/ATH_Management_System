
import { Edit2, X, Save } from "lucide-react";

interface ProgramEditControlsProps {
  isEditing: boolean;
  cancelEditing: () => void;
  saveChanges: () => void;
  setIsEditing: (value: boolean) => void;
}

export const ProgramEditControls = ({
  isEditing,
  cancelEditing,
  saveChanges,
  setIsEditing
}: ProgramEditControlsProps) => {
  return (
    <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
      {isEditing ? (
        <div className="flex gap-1">
          <button 
            onClick={cancelEditing}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            title="Annulla"
          >
            <X className="h-4 w-4" />
          </button>
          <button 
            onClick={saveChanges}
            className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700"
            title="Salva"
          >
            <Save className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          title="Modifica"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
