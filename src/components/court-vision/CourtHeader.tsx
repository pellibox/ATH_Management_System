
import { useState } from "react";
import { X, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CourtHeaderProps {
  courtName: string;
  courtNumber: number;
  type: string;
  setIsOpen: (isOpen: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  isEditing: boolean;
  handleSaveCourtName: () => void;
  setCourtName: (name: string) => void;
}

export function CourtHeader({
  courtName,
  courtNumber,
  type,
  setIsOpen,
  setIsEditing,
  isEditing,
  handleSaveCourtName,
  setCourtName
}: CourtHeaderProps) {
  const getCourtLabel = () => {
    const typeParts = type.split("-");
    const surface = typeParts.length > 1 ? ` (${typeParts[1]})` : "";
    return `${typeParts[0].charAt(0).toUpperCase() + typeParts[0].slice(1)}${surface}`;
  };

  return (
    <div className="flex items-center justify-between bg-ath-black p-3 text-white rounded-t-lg">
      {isEditing ? (
        <div className="flex-1 flex items-center">
          <input
            type="text"
            value={courtName}
            onChange={(e) => setCourtName(e.target.value)}
            className="flex-1 bg-ath-black text-white font-semibold border-b border-white px-1 py-0.5 focus:outline-none"
            autoFocus
          />
          <button onClick={handleSaveCourtName} className="ml-2 text-white hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      ) : (
        <h3 className="font-semibold">{courtName} #{courtNumber} - {getCourtLabel()}</h3>
      )}
      <div className="flex items-center">
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-white hover:text-gray-300 mr-2">
            <Edit className="h-4 w-4" />
          </button>
        )}
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
