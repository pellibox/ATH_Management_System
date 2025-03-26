
import React, { useState, useMemo } from "react";
import { Player } from "@/types/player";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { GridView } from "./views/GridView";
import { ListView } from "./views/ListView";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody,
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Grid, List, SortAsc, SortDesc } from "lucide-react";

export function EnhancedPlayerList() {
  const { filteredPlayers, searchQuery, setSearchQuery } = usePlayerContext();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"name" | "level" | "coach">("name");
  
  // Get all unique sports
  const uniqueSports = useMemo(() => {
    const sports = new Set<string>();
    filteredPlayers.forEach(player => {
      if (player.sports && Array.isArray(player.sports)) {
        player.sports.forEach(sport => sports.add(sport));
      } else if (typeof player.sports === "string") {
        sports.add(player.sports);
      }
    });
    return Array.from(sports);
  }, [filteredPlayers]);
  
  // Get all unique programs
  const uniquePrograms = useMemo(() => {
    const programs = new Set<string>();
    filteredPlayers.forEach(player => {
      if (player.program) {
        programs.add(player.program);
      }
    });
    return Array.from(programs);
  }, [filteredPlayers]);
  
  // Apply additional filters and sorting
  const players = useMemo(() => {
    let result = [...filteredPlayers];
    
    // Apply sport filter
    if (sportFilter !== "all") {
      result = result.filter(player => {
        if (Array.isArray(player.sports)) {
          return player.sports.includes(sportFilter);
        } else if (typeof player.sports === "string") {
          return player.sports === sportFilter;
        }
        return false;
      });
    }
    
    // Apply program filter
    if (programFilter !== "all") {
      result = result.filter(player => player.program === programFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const valueA = a[sortBy]?.toLowerCase() || "";
      const valueB = b[sortBy]?.toLowerCase() || "";
      
      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
    
    return result;
  }, [filteredPlayers, sportFilter, programFilter, sortBy, sortDirection]);
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Cerca giocatori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <div className="flex gap-2 self-start sm:self-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Sport
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setSportFilter("all")}
                className={sportFilter === "all" ? "bg-gray-100" : ""}
              >
                Tutti gli Sport
              </DropdownMenuItem>
              {uniqueSports.map(sport => (
                <DropdownMenuItem 
                  key={sport}
                  onClick={() => setSportFilter(sport)}
                  className={sportFilter === sport ? "bg-gray-100" : ""}
                >
                  {sport}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Programma
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setProgramFilter("all")}
                className={programFilter === "all" ? "bg-gray-100" : ""}
              >
                Tutti i Programmi
              </DropdownMenuItem>
              {uniquePrograms.map(program => (
                <DropdownMenuItem 
                  key={program}
                  onClick={() => setProgramFilter(program)}
                  className={programFilter === program ? "bg-gray-100" : ""}
                >
                  {program}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" className="h-9" onClick={toggleSortDirection}>
            {sortDirection === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
          
          <div className="border-l h-9 mx-1"></div>
          
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "grid")}>
            <TabsList className="h-9">
              <TabsTrigger value="list" className="px-3">
                <List className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="grid" className="px-3">
                <Grid className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {viewMode === "list" ? (
        <ListView players={players} />
      ) : (
        <GridView players={players} />
      )}
    </div>
  );
}
