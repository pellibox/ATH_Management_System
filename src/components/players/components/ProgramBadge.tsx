
import { getProgramColor } from "../utils/programUtils";

interface ProgramBadgeProps {
  program?: string;
  programId?: string;  // For backward compatibility
}

export function ProgramBadge({ program, programId }: ProgramBadgeProps) {
  // Use program prop or fallback to programId for backward compatibility
  const programName = program || programId;
  
  if (!programName) {
    return <span className="text-gray-500">Non assegnato</span>;
  }
  
  const programColor = getProgramColor(programName);
  
  return (
    <span 
      className="px-2 py-1 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${programColor}20`, 
        color: programColor,
        border: `1px solid ${programColor}40`
      }}
    >
      {programName}
    </span>
  );
}
