
import { Program } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PeopleFiltersProps {
  programs: Program[];
  programFilter: string;
  setProgramFilter: (value: string) => void;
  availabilityFilter?: string;
  setAvailabilityFilter?: (value: string) => void;
  showAvailabilityFilter?: boolean;
}

export function PeopleFilters({ 
  programs, 
  programFilter, 
  setProgramFilter,
  availabilityFilter,
  setAvailabilityFilter,
  showAvailabilityFilter = false
}: PeopleFiltersProps) {
  return (
    <div className="mb-3 flex items-center space-x-2">
      <div className="flex-1">
        <Select value={programFilter} onValueChange={setProgramFilter}>
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Filtra per programma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i programmi</SelectItem>
            <SelectItem value="none">Senza programma</SelectItem>
            {programs.map(program => (
              <SelectItem key={program.id} value={program.id}>
                <div className="flex items-center">
                  <div 
                    className="h-2 w-2 rounded-full mr-1" 
                    style={{ backgroundColor: program.color }}
                  ></div>
                  {program.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {showAvailabilityFilter && setAvailabilityFilter && availabilityFilter && (
        <div className="flex-1">
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Filtra per disponibilità" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              <SelectItem value="available">Disponibili</SelectItem>
              <SelectItem value="unavailable">Non disponibili</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
