import { Clock } from "lucide-react";

// This component is no longer used, but we'll keep it as a simplified version for reference
export function CourtControls() {
  return (
    <div className="absolute top-10 right-2 flex gap-1">
      <button 
        className="text-xs px-2 py-1 rounded bg-ath-black text-white"
      >
        <Clock className="h-3 w-3" />
      </button>
    </div>
  );
}
