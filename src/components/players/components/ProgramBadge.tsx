
import { getProgramColor } from "../utils/programUtils";

interface ProgramBadgeProps {
  program?: string;
}

export function ProgramBadge({ program }: ProgramBadgeProps) {
  if (!program) {
    return <span className="text-gray-500">Non assegnato</span>;
  }
  
  const programColor = getProgramColor(program);
  
  return (
    <span 
      className="px-2 py-1 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${programColor}20`, 
        color: programColor,
        border: `1px solid ${programColor}40`
      }}
    >
      {program}
    </span>
  );
}
