
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AvailabilityFilterProps {
  availabilityFilter: string;
  setAvailabilityFilter: (value: string) => void;
}

export function AvailabilityFilter({ availabilityFilter, setAvailabilityFilter }: AvailabilityFilterProps) {
  return (
    <div className="flex-1">
      <Select value={availabilityFilter} onValueChange={(value) => setAvailabilityFilter(value)}>
        <SelectTrigger className="w-full h-8 text-xs">
          <SelectValue placeholder="Filtra per disponibilità" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">Tutti</SelectItem>
          <SelectItem value="available">Disponibili</SelectItem>
          <SelectItem value="unavailable">Non disponibili</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
