
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { getCourtLabel } from "./CourtStyleUtils";

interface CourtHeaderProps {
  courtName: string;
  courtNumber: number;
  courtType: string;
  onChangeNumber?: (number: number) => void;
}

export function CourtHeader({ 
  courtName, 
  courtNumber, 
  courtType,
  onChangeNumber
}: CourtHeaderProps) {
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [editedNumber, setEditedNumber] = useState(courtNumber);

  const handleSaveCourtNumber = () => {
    if (onChangeNumber && !isNaN(editedNumber)) {
      onChangeNumber(editedNumber);
    }
    setIsEditingNumber(false);
  };

  return (
    <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
      <span className="text-xs font-medium bg-ath-black/70 text-white px-2 py-1 rounded">
        {courtName} 
        <span className="ml-1 cursor-pointer" onClick={(e) => {
          e.stopPropagation();
          setIsEditingNumber(true);
        }}>
          #{courtNumber}
        </span>
        {isEditingNumber && (
          <div onClick={(e) => e.stopPropagation()} className="absolute z-50 mt-1 bg-white rounded shadow-md p-2">
            <Input
              type="number"
              value={editedNumber}
              onChange={(e) => setEditedNumber(parseInt(e.target.value) || 1)}
              className="w-16 h-8 text-xs text-black"
              min={1}
              autoFocus
              onBlur={handleSaveCourtNumber}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveCourtNumber();
                } else if (e.key === 'Escape') {
                  setIsEditingNumber(false);
                  setEditedNumber(courtNumber);
                }
              }}
            />
          </div>
        )}
      </span>
      <span className="text-xs bg-ath-black/70 text-white px-2 py-1 rounded">{getCourtLabel(courtType)}</span>
    </div>
  );
}
