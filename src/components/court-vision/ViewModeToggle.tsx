
import { useNavigate } from "react-router-dom";
import { Layers } from "lucide-react";
import { useCourtVision } from "./context/CourtVisionContext";

export function ViewModeToggle() {
  const { currentSport } = useCourtVision();
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    try {
      console.log("Navigating to court vision with current sport:", currentSport);
      const newPath = '/court-vision' + (currentSport ? `?sport=${currentSport}` : '');
      console.log("Navigating to:", newPath);
      navigate(newPath);
    } catch (error) {
      console.error("Error in ViewModeToggle:", error);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded text-sm font-medium bg-ath-blue text-white transition-colors"
        onClick={handleNavigate}
        title="Vista Programmazione"
        type="button"
      >
        <Layers className="h-4 w-4" />
        <span className="hidden sm:inline">Programmazione</span>
      </button>
    </div>
  );
}
