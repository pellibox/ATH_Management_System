
import { Program } from "../types";
import { Badge } from "@/components/ui/badge";

interface ProgramBadgesProps {
  programs: Program[];
}

export function ProgramBadges({ programs }: ProgramBadgesProps) {
  if (programs.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap mt-1 gap-1">
      {programs.map(program => (
        <Badge 
          key={program.id} 
          variant="outline" 
          className="text-xs px-1.5 py-0"
          style={{ 
            backgroundColor: program.color,
            color: 'white',
            fontSize: '0.65rem'
          }}
        >
          {program.name}
        </Badge>
      ))}
    </div>
  );
}
