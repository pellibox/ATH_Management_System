
import { Button } from "@/components/ui/button";
import { getCategoryTitle } from "@/contexts/programs/constants";
import { ProgramCategoriesMap } from "@/contexts/programs/types";

interface ProgramFiltersProps {
  categories: ProgramCategoriesMap;
  activeFilter: string;
  setFilter: (filter: string) => void;
}

export const ProgramFilters = ({ categories, activeFilter, setFilter }: ProgramFiltersProps) => {
  return (
    <div className="mb-6 bg-white shadow-sm rounded-lg p-1 inline-flex items-center overflow-x-auto">
      <button
        onClick={() => setFilter("all")}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
          activeFilter === "all"
            ? "bg-ath-blue-light text-ath-blue"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Tutti i Programmi
      </button>
      
      {Object.entries(categories).map(([key, value]) => (
        <button
          key={key}
          onClick={() => setFilter(value.id)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === value.id
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {getCategoryLabel(key)}
        </button>
      ))}
    </div>
  );
};

// Helper to get human-readable category labels
function getCategoryLabel(categoryKey: string): string {
  const labels: Record<string, string> = {
    PERFORMANCE: "Agonisti Performance",
    JUNIOR: "Junior",
    PERSONAL: "Personal Coaching",
    ADULT: "Adulti e Universitari",
    COACH: "Coach",
    PADEL: "Padel"
  };
  
  return labels[categoryKey] || categoryKey;
}
