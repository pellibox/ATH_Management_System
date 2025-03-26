
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Program } from "../../types";

interface ProgramFilterProps {
  programs: Program[];
  programFilter: string;
  setProgramFilter: (value: string) => void;
}

export function ProgramFilter({ programs, programFilter, setProgramFilter }: ProgramFilterProps) {
  return (
    <div className="flex-1">
      <Select value={programFilter} onValueChange={(value) => setProgramFilter(value)}>
        <SelectTrigger className="w-full h-8 text-xs">
          <SelectValue placeholder="Filtra per programma" />
        </SelectTrigger>
        <SelectContent className="bg-white">
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
  );
}
