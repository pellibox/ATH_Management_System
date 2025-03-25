
import { Plus, Search } from "lucide-react";

interface ProgramsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ProgramsHeader = ({ searchQuery, setSearchQuery }: ProgramsHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Programmi</h1>
        <p className="text-gray-600 mt-1">Gestisci i programmi di allenamento e i corsi</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Cerca programmi..."
            className="h-10 w-64 rounded-lg bg-white shadow-sm pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Nuovo Programma</span>
        </button>
      </div>
    </div>
  );
};
