
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlayerContext } from "@/contexts/PlayerContext";

export function PlayerFilters() {
  const { levelFilter, setLevelFilter, coachFilter, setCoachFilter, coaches, resetFilters } = usePlayerContext();

  return (
    <div className="mb-6 bg-white shadow-sm rounded-lg p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[180px] text-sm h-9">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={coachFilter} onValueChange={setCoachFilter}>
            <SelectTrigger className="w-[180px] text-sm h-9">
              <SelectValue placeholder="Select Coach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coaches</SelectItem>
              {coaches.map((coach) => (
                <SelectItem key={coach} value={coach}>{coach}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="ml-auto">
          <Button variant="outline" size="sm" className="h-9" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
