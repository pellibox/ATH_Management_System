
import { Search } from "lucide-react";
import { AddCoachDialog } from "./AddCoachDialog";

interface CoachesHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  newCoach: {
    name: string;
    email: string;
    phone: string;
    sportTypes: string[];
  };
  setNewCoach: (coach: {
    name: string;
    email: string;
    phone: string;
    sportTypes: string[];
  }) => void;
  handleAddCoach: () => void;
  toggleSportType: (sport: string) => void;
  allSportTypes: string[];
}

export function CoachesHeader({
  searchQuery,
  setSearchQuery,
  newCoach,
  setNewCoach,
  handleAddCoach,
  toggleSportType,
  allSportTypes
}: CoachesHeaderProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Database Allenatori</h1>
        <p className="text-gray-600 mt-1">Gestisci profili, programmazione e disponibilità degli allenatori</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Cerca allenatori..."
            className="h-10 w-64 rounded-lg bg-white shadow-sm pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <AddCoachDialog 
          newCoach={newCoach}
          setNewCoach={setNewCoach}
          handleAddCoach={handleAddCoach}
          toggleSportType={toggleSportType}
          allSportTypes={allSportTypes}
        />
      </div>
    </div>
  );
}
