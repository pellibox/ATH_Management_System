
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
        <SelectContent className="bg-white max-h-[300px]">
          <SelectItem value="all">Tutti i programmi</SelectItem>
          <SelectItem value="none">Senza programma</SelectItem>
          
          {/* Group programs by category */}
          {Object.entries(groupProgramsByCategory(programs)).map(([category, categoryPrograms]) => (
            <div key={category}>
              <div className="text-xs font-bold text-gray-500 px-2 py-1 mt-1">{category}</div>
              {categoryPrograms.map(program => (
                <SelectItem key={program.id} value={program.id}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: program.color }}
                    ></div>
                    <span className="text-xs">{program.name}</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Helper function to group programs by category
function groupProgramsByCategory(programs: Program[]): Record<string, Program[]> {
  const result: Record<string, Program[]> = {
    "Performance": [],
    "Junior": [],
    "Adult": [],
    "Personal": [],
    "Coach": [],
    "Padel": [],
    "Altri": []
  };
  
  programs.forEach(program => {
    // Check if program has a category property
    if (program.category) {
      switch (program.category.toLowerCase()) {
        case 'performance':
          result["Performance"].push(program);
          break;
        case 'junior':
          result["Junior"].push(program);
          break;
        case 'adult':
          result["Adult"].push(program);
          break;
        case 'personal':
          result["Personal"].push(program);
          break;
        case 'coach':
          result["Coach"].push(program);
          break;
        case 'padel':
          result["Padel"].push(program);
          break;
        default:
          result["Altri"].push(program);
      }
    } else {
      // Infer category from program name
      const name = program.name.toLowerCase();
      if (name.includes('performance') || name.includes('perf') || name.includes('elite')) {
        result["Performance"].push(program);
      } else if (name.includes('junior') || name.includes('sit') || name.includes('sat')) {
        result["Junior"].push(program);
      } else if (name.includes('adult') || name.includes('senior')) {
        result["Adult"].push(program);
      } else if (name.includes('coach') || name.includes('allenator')) {
        result["Coach"].push(program);
      } else if (name.includes('padel')) {
        result["Padel"].push(program);
      } else if (name.includes('personal') || name.includes('private')) {
        result["Personal"].push(program);
      } else {
        result["Altri"].push(program);
      }
    }
  });
  
  // Remove empty categories
  const filteredResult: Record<string, Program[]> = {};
  Object.entries(result).forEach(([key, programs]) => {
    if (programs.length > 0) {
      filteredResult[key] = programs;
    }
  });
  
  return filteredResult;
}
