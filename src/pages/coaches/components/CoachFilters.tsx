
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Program } from "@/components/court-vision/types";

interface CoachFiltersProps {
  sportTypeFilter: string;
  setSportTypeFilter: (value: string) => void;
  programFilter: string;
  setProgramFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
  allSportTypes: string[];
  programs: Program[];
}

export function CoachFilters({
  sportTypeFilter,
  setSportTypeFilter,
  programFilter,
  setProgramFilter,
  setSearchQuery,
  allSportTypes,
  programs
}: CoachFiltersProps) {
  // Lista dei programmi da escludere
  const EXCLUDED_PROGRAMS = [
    "tennis-academy", 
    "padel-club", 
    "junior-development", 
    "high-performance"
  ];

  // Filtriamo i programmi per escludere quelli nella lista
  const filteredPrograms = programs.filter(program => 
    !EXCLUDED_PROGRAMS.includes(program.id)
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSportTypeFilter("all");
    setProgramFilter("all");
  };

  return (
    <div className="mb-6 bg-white shadow-sm rounded-lg p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm font-medium">Filtri:</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={sportTypeFilter} onValueChange={setSportTypeFilter}>
            <SelectTrigger className="w-[180px] text-sm h-9">
              <SelectValue placeholder="Seleziona Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli Sport</SelectItem>
              {allSportTypes.map(sport => (
                <SelectItem key={sport} value={sport} className="capitalize">{sport}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-[180px] text-sm h-9">
              <SelectValue placeholder="Seleziona Programma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i Programmi</SelectItem>
              {filteredPrograms.map(program => (
                <SelectItem key={program.id} value={program.id}>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: program.color }}
                    ></div>
                    {program.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9" 
            onClick={resetFilters}
          >
            Reset Filtri
          </Button>
        </div>
      </div>
    </div>
  );
}
