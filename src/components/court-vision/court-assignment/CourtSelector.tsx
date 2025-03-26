
import React from "react";
import { CourtProps } from "../types";

interface CourtSelectorProps {
  courts: CourtProps[];
  selectedCourt: CourtProps | null;
  setSelectedCourt: (court: CourtProps) => void;
}

export function CourtSelector({ 
  courts, 
  selectedCourt, 
  setSelectedCourt 
}: CourtSelectorProps) {
  return (
    <>
      <h3 className="text-sm font-medium mb-2">Select Court</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {courts.map((court) => (
          <div
            key={court.id}
            className={`p-2 border rounded cursor-pointer ${
              selectedCourt?.id === court.id ? "bg-ath-red-clay/10 border-ath-red-clay" : ""
            }`}
            onClick={() => setSelectedCourt(court)}
          >
            <div className="font-medium text-sm">
              {court.name} #{court.number}
            </div>
            <div className="text-xs text-gray-500">
              {court.occupants.length} people assigned
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
