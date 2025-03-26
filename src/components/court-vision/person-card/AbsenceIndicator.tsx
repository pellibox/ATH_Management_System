
import { AlertCircle } from "lucide-react";
import { PersonData } from "../types";

interface AbsenceIndicatorProps {
  person: PersonData;
}

export function AbsenceIndicator({ person }: AbsenceIndicatorProps) {
  if (person.isPresent !== false) {
    return null;
  }
  
  return (
    <div className="flex items-center mt-1 text-xs text-red-500">
      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
      <span className="truncate max-w-[140px]">
        {person.absenceReason || "Non disponibile"}
      </span>
    </div>
  );
}
