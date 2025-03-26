
import { useNavigate } from "react-router-dom";
import { Layers, LayoutGrid } from "lucide-react";
import { useCourtVision } from "./CourtVisionContext";

export function ViewModeToggle() {
  const { isLayoutView, currentSport } = useCourtVision();
  const navigate = useNavigate();
  
  const toggleViewMode = () => {
    try {
      console.log("Toggling view mode, current state:", { isLayoutView, currentSport });
      
      if (isLayoutView) {
        const newPath = '/court-vision' + (currentSport ? `?sport=${currentSport}` : '');
        console.log("Navigating to:", newPath);
        navigate(newPath);
      } else {
        const newPath = '/court-vision/layout' + (currentSport ? `?sport=${currentSport}` : '');
        console.log("Navigating to:", newPath);
        navigate(newPath);
      }
    } catch (error) {
      console.error("Error in ViewModeToggle:", error);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded text-sm font-medium transition-colors ${
          !isLayoutView ? "bg-ath-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={toggleViewMode}
        title="Vista Programmazione"
        type="button"
      >
        <Layers className="h-4 w-4" />
        <span className="hidden sm:inline">Programmazione</span>
      </button>
      
      <button
        className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded text-sm font-medium transition-colors ${
          isLayoutView ? "bg-ath-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={toggleViewMode}
        title="Vista Layout"
        type="button"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Layout</span>
      </button>
    </div>
  );
}
