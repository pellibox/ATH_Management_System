
import { Button } from "@/components/ui/button";
import { PROGRAM_CATEGORIES } from "@/contexts/programs/constants";

interface ProgramFiltersProps {
  activeFilter: string;
  setFilter: (filter: string) => void;
}

export const ProgramFilters = ({ activeFilter, setFilter }: ProgramFiltersProps) => {
  // Get category keys for filters
  const categoryKeys = Object.keys(PROGRAM_CATEGORIES);
  
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
      
      {categoryKeys.map((key) => (
        <button
          key={key}
          onClick={() => setFilter(key.toLowerCase())}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === key.toLowerCase()
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {PROGRAM_CATEGORIES[key].title}
        </button>
      ))}
    </div>
  );
};
