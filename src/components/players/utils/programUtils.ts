
import { DEFAULT_PROGRAMS } from "@/components/court-vision/constants";

export const getProgramColor = (program: string | undefined) => {
  if (!program) return "#e0e0e0"; // Default gray
  
  const foundProgram = DEFAULT_PROGRAMS.find(p => p.name === program || p.id === program);
  if (foundProgram) {
    return foundProgram.color;
  }
  
  const hash = program.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8B5CF6", "#EC4899"];
  return colors[hash % colors.length];
};
