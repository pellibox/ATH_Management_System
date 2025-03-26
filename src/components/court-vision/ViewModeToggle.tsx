
import { useNavigate } from "react-router-dom";
import { Layers, LayoutGrid } from "lucide-react";
import { useCourtVision } from "./context/CourtVisionContext";

export function ViewModeToggle() {
  const { isLayoutView, currentSport } = useCourtVision();
  const navigate = useNavigate();
  
  const toggleViewMode = () => {
    if (isLayoutView) {
      navigate('/court-vision' + (currentSport ? `?sport=${currentSport}` : ''));
    } else {
      navigate('/court-vision/layout' + (currentSport ? `?sport=${currentSport}` : ''));
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
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Layout</span>
      </button>
    </div>
  );
}
