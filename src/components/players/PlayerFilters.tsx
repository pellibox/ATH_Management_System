
import React from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePlayerContext } from "@/contexts/PlayerContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function PlayerFilters() {
  const {
    searchQuery,
    setSearchQuery,
    programFilter,
    setProgramFilter,
    resetFilters,
    players,
  } = usePlayerContext();

  // Get unique programs
  const programs = React.useMemo(() => {
    const uniquePrograms = new Set<string>();
    players.forEach((player) => {
      if (player.program) {
        uniquePrograms.add(player.program);
      }
    });
    return Array.from(uniquePrograms);
  }, [players]);

  const isFiltersApplied = searchQuery || programFilter !== "all";

  return (
    <div className="mb-6 space-y-2">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Cerca giocatori..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex gap-2 items-center">
                <Filter className="h-4 w-4" />
                <span>Programma</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i programmi</SelectItem>
              {programs.map((program) => (
                <SelectItem key={program} value={program}>
                  {program}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isFiltersApplied && (
            <Button variant="ghost" onClick={resetFilters} className="h-10">
              Reset filtri
            </Button>
          )}
        </div>
      </div>

      {isFiltersApplied && (
        <div className="flex flex-wrap gap-2 mt-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1 pl-2">
              Ricerca: {searchQuery}
              <button
                onClick={() => setSearchQuery("")}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {programFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 pl-2">
              Programma: {programFilter}
              <button
                onClick={() => setProgramFilter("all")}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
