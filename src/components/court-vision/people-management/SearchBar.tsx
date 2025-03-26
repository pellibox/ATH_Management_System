
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearch }: SearchBarProps) {
  return (
    <div className="mb-3">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Cerca per nome o email..." 
          value={searchQuery} 
          onChange={(e) => onSearch(e.target.value)}
          className="pl-8 h-8 text-sm" 
        />
      </div>
    </div>
  );
}
