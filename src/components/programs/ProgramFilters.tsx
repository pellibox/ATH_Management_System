
import { Button } from "@/components/ui/button";

interface ProgramFiltersProps {
  activeFilter: string;
  setFilter: (filter: string) => void;
}

export const ProgramFilters = ({ activeFilter, setFilter }: ProgramFiltersProps) => {
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
    </div>
  );
};
