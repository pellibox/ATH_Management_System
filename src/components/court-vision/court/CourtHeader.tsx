
import React from "react";
import { ValidationManager } from "./ValidationManager";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

interface CourtHeaderProps {
  courtName: string;
  courtNumber: number;
  courtType: string;
  occupants: any[];
  onValidate: () => void;
  onRenameCourt?: (newName: string) => void;
  onChangeCourtType?: (newType: string) => void;
  onChangeNumber?: (number: number) => void;
}

export function CourtHeader({ 
  courtName, 
  courtNumber, 
  courtType, 
  occupants,
  onValidate,
  onRenameCourt,
  onChangeCourtType,
  onChangeNumber
}: CourtHeaderProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newNumber, setNewNumber] = React.useState(courtNumber);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setNewNumber(value);
    }
  };

  const handleNumberBlur = () => {
    if (newNumber !== courtNumber && onChangeNumber) {
      onChangeNumber(newNumber);
    }
    setIsEditing(false);
  };

  return (
    <div className="sticky top-0 py-3 px-4 bg-white bg-opacity-95 z-30 border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-gray-800 flex items-center">
          {courtName}{' '}
          {isEditing ? (
            <Input
              type="number"
              value={newNumber}
              onChange={handleNumberChange}
              onBlur={handleNumberBlur}
              className="w-16 h-8 ml-1 text-center"
              autoFocus
            />
          ) : (
            <span className="flex items-center">
              #{courtNumber}
              {onChangeNumber && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          )}
        </h3>
        
        <div className="flex items-center">
          <Badge variant="outline" className="ml-2 text-xs font-normal px-2 py-1">
            {getCourtLabel(courtType)}
          </Badge>
          
          <ValidationManager 
            occupants={occupants}
            onValidate={onValidate}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to format court type
const getCourtLabel = (courtType: string): string => {
  const type = courtType.split("-");
  if (type.length > 1) {
    return type[0].charAt(0).toUpperCase() + type[0].slice(1) + " (" + 
           type[1].charAt(0).toUpperCase() + type[1].slice(1) + ")";
  }
  return courtType.charAt(0).toUpperCase() + courtType.slice(1);
};
