
import { PersonData } from "../types";

interface CourtFooterProps {
  occupants: PersonData[];
}

export function CourtFooter({ occupants }: CourtFooterProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-ath-black/10 max-h-20 overflow-y-auto">
      {occupants.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          <div className="text-xs text-gray-800 font-medium">
            {occupants.length} {occupants.length === 1 ? 'persona' : 'persone'}
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-500 italic">Campo vuoto</div>
      )}
    </div>
  );
}
