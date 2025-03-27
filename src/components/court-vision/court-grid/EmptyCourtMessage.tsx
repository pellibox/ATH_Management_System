
import React from "react";

export function EmptyCourtMessage() {
  return (
    <div className="text-center py-6 md:py-12 bg-gray-50 rounded-lg mx-4">
      <p className="text-base md:text-lg text-gray-500">Non ci sono campi configurati per questo tipo</p>
      <p className="text-xs md:text-sm text-gray-400 mt-1">
        Puoi aggiungere campi dalle Impostazioni → Campi
      </p>
    </div>
  );
}
