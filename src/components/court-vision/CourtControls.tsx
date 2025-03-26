
import { Clock } from "lucide-react";

interface CourtControlsProps {
  viewMode: "layout" | "schedule";
  setViewMode: (mode: "layout" | "schedule") => void;
}

export function CourtControls({ viewMode, setViewMode }: CourtControlsProps) {
  return (
    <div className="absolute top-10 right-2 flex gap-1">
      <button 
        className={`text-xs px-2 py-1 rounded ${viewMode === "layout" ? "bg-ath-black text-white" : "bg-gray-200"}`}
        onClick={(e) => {
          e.stopPropagation();
          setViewMode("layout");
        }}
      >
        Layout
      </button>
      <button 
        className={`text-xs px-2 py-1 rounded ${viewMode === "schedule" ? "bg-ath-black text-white" : "bg-gray-200"}`}
        onClick={(e) => {
          e.stopPropagation();
          setViewMode("schedule");
        }}
      >
        <Clock className="h-3 w-3" />
      </button>
    </div>
  );
}
